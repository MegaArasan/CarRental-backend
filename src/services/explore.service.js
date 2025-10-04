const Offer = require('../models/offerModel');
const Booking = require('../models/bookingModel');
const { getCount, getAll } = require('./car.service');

const getExploreData = async (filters) => {
  const now = new Date();
  const { type, minPrice, maxPrice, search, page = 1, limit = 10 } = filters;

  // Base query for active cars
  const query = { isActive: true };

  // Filter by car type
  if (type) {
    query.type = type;
  }

  // Filter by price range
  if (minPrice || maxPrice) {
    query.pricePerHour = {};
    if (minPrice) {
      query.pricePerHour.$gte = Number(minPrice);
    }
    if (maxPrice) {
      query.pricePerHour.$lte = Number(maxPrice);
    }
  }

  // Search by brand or model name
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { brand: { $regex: search, $options: 'i' } },
      { model: { $regex: search, $options: 'i' } }
    ];
  }

  // Get cars with pagination (delegated to car service)
  const featuredCars = await getAll(query, page, limit);

  // Fetch active offers with car details
  const topDeals = await Offer.find({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now }
  })
    .populate('carId', 'manufacturer model variant rentPerHour')
    .lean();

  // Popular cars based on booking count
  const popularCars = await Booking.aggregate([
    { $group: { _id: '$car', totalBookings: { $sum: 1 } } },
    { $sort: { totalBookings: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'cars',
        localField: '_id',
        foreignField: '_id',
        as: 'carDetails'
      }
    },
    { $unwind: '$carDetails' },
    {
      $project: {
        _id: '$carDetails._id',
        name: '$carDetails.name',
        brand: '$carDetails.brand',
        model: '$carDetails.model',
        pricePerHour: '$carDetails.pricePerHour',
        image: '$carDetails.image',
        totalBookings: 1
      }
    }
  ]);

  // Get total car count for pagination
  const totalCount = await getCount(query);

  return {
    featuredCars,
    topDeals,
    popularCars,
    pagination: {
      total: totalCount,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(totalCount / limit)
    }
  };
};

module.exports = { getExploreData };
