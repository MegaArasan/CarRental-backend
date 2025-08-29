const Car = require('../models/carsModel');
const FileAttachment = require('../models/attachmentModel');
const Booking = require('../models/bookingModel');
const ErrorResponse = require('../errors/errorResponse');

const getAll = async (filter, page = 1, limit = 10) => {
  try {
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
      let thumbId = car.thumbnail;
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
  } catch (error) {
    throw error;
  }
};

const getOne = async (id) => {
  try {
    const result = await Car.findById(id);
    if (!result) {
      throw new ErrorResponse(404, 'Car Not found for the given ID');
    }
    const baseUrl = process.env.BASE_URL;

    let imageId = result.image;
    let image = '';
    if (imageId) {
      image = `${baseUrl}/api/v1/image/${result.image}`;
    } else {
      image = result.image;
    }

    const booking = await Booking.find({ car: result._id });
    console.log(booking);
    return {
      ...result._doc,
      image
    };
  } catch (error) {
    throw error;
  }
};

const getCount = async (filter) => {
  try {
    const count = await Car.countDocuments(filter);

    return count;
  } catch (error) {
    throw error;
  }
};

const addCar = async (data) => {
  try {
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
  } catch (error) {
    throw error;
  }
};

const edit = async (id, data) => {
  try {
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
  } catch (error) {
    throw error;
  }
};

module.exports = { addCar, getAll, getCount, edit, getOne };
