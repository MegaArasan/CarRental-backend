const User = require('../models/userModel');
const Car = require('../models/carsModel');
const Booking = require('../models/bookingModel');
// const Driver = require('../models/driverModel');
const Offer = require('../models/offerModel');

exports.generateReportData = async (type) => {
  switch (type) {
    case 'users':
      return await User.find({}, 'username email phone role createdAt').lean();

    case 'cars':
      return await Car.find({}, 'manufacturer model variant segment rentPerHour status').lean();

    // case 'drivers':
    //   return await Driver.find({}, 'name phone licenseNo status city').lean();

    case 'bookings':
      return await Booking.find({})
        .populate('user', 'username email')
        .populate('car', 'manufacturer model')
        .lean()
        .then((data) =>
          data.map((b) => ({
            bookingId: b._id,
            user: b.user?.username || 'N/A',
            car: `${b.car?.manufacturer} ${b.car?.model}`,
            totalAmount: b.totalAmount,
            status: b.status,
            createdAt: b.createdAt
          }))
        );

    case 'offers':
      return await Offer.find(
        {},
        'title discountType discountValue promoCode startDate endDate isActive'
      ).lean();

    case 'summary': {
      const usersCount = await User.countDocuments();
      const carsCount = await Car.countDocuments();
      const bookingsCount = await Booking.countDocuments();
      const totalRevenue = await Booking.aggregate([
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]);
      return {
        usersCount,
        carsCount,
        bookingsCount,
        totalRevenue: totalRevenue[0]?.total || 0
      };
    }

    default:
      return [];
  }
};
