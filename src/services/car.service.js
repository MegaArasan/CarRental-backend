const Car = require('../models/carsModel');
const FileAttachment = require('../models/attachmentModel');
const Booking = require('../models/bookingModel');
const ErrorResponse = require('../errors/errorResponse');

const getAll = async (filter, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const result = await Car.find(filter)
    .skip(skip)
    .limit(limit)
    // .populate({
    //   path: 'image',
    //   select: 'thumbnail'
    // })
    .lean();
  const baseUrl = process.env.BASE_URL;

  const transformed = result.map((car) => {
    const thumbId = car.thumbnail;
    let image = '';
    if (thumbId) {
      image = `${baseUrl}/api/v1/image/${car.thumbnail}`;
    } else {
      image = car.image;
    }
    return {
      ...car,
      image
    };
  });

  return transformed;
};

const getOne = async (id) => {
  const result = await Car.findById(id);
  if (!result) {
    throw new ErrorResponse(404, 'Car Not found for the given ID');
  }
  const baseUrl = process.env.BASE_URL;

  const imageId = result.image;
  let image = '';
  if (imageId) {
    image = `${baseUrl}/api/v1/image/${result.image}`;
  } else {
    image = result.image;
  }

  const bookings = await Booking.find({ car: result._id }).lean();

  return {
    ...result._doc,
    bookings,
    image
  };
};

const getCount = async (filter) => {
  const count = await Car.countDocuments(filter);

  return count;
};

const addCar = async (data) => {
  const newCar = {
    manufacturer: data.manufacturer,
    model: data.model,
    variant: data.variant,
    transmission: data.transmission,
    segment: data.segment,
    image: data.image,
    thumbnail: data.thumbnail,
    capacity: data.capacity,
    fuelType: data.fuelType,
    rentPerHour: data.rentPerHour,
    status: 'active',
    location: {
      city: data.location.city,
      state: data.location.state,
      country: data.location.country
    }
  };

  const result = await Car.create(newCar);

  await FileAttachment.updateOne(
    { gridFsFileId: data.image, thumbnailFileId: data.thumbnail },
    {
      $set: {
        relatedModel: 'Car',
        relatedId: result._id,
        isLinked: true
      }
    }
  );

  return result;
};

const edit = async (id, data) => {
  const updatedCar = {
    manufacturer: data.manufacturer,
    model: data.model,
    variant: data.variant,
    transmission: data.transmission,
    segment: data.segment,
    image: data.image,
    thumbnail: data.thumbnail,
    capacity: data.capacity,
    fuelType: data.fuelType,
    rentPerHour: data.rentPerHour,
    status: data.status || 'active',
    location: {
      city: data.location?.city,
      state: data.location?.state,
      country: data.location?.country
    }
  };

  const result = await Car.findByIdAndUpdate(id, updatedCar, {
    new: true,
    runValidators: true
  });

  // Optional: only update FileAttachment if image is GridFS
  if (data.image && data.thumbnail) {
    await FileAttachment.updateOne(
      { gridFsFileId: data.image, thumbnailFileId: data.thumbnail },
      {
        $set: {
          relatedModel: 'Car',
          relatedId: result._id,
          isLinked: true
        }
      }
    );
  }

  return result;
};

module.exports = { addCar, getAll, getCount, edit, getOne };
