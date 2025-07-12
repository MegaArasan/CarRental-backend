const Car = require('../models/carsModel');
const FileAttachment = require('../models/attachmentModel');

const getAll = async (filter, page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;

    const result = await Car.find(filter)
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'image',
        select: 'thumbnail'
      })
      .lean();
    const baseUrl = process.env.BASE_URL;

    const transformed = result.map((car) => {
      let thumbId = car.image?.thumbnail;
      return {
        ...car,
        image: thumbId ? `${baseUrl}/api/v1/image/${car.image.thumbnail}` : null
      };
    });

    return transformed;
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

module.exports = { addCar, getAll, getCount };
