const Car = require('../models/carsModel');

const getAll = async (manufacturer, segment, page = 1, limit = 10) => {
  try {
    const filter = {};

    if (manufacturer) {
      filter.manufacturer = manufacturer;
    }

    if (segment) {
      filter.segment = segment;
    }

    const skip = (page - 1) * limit;

    const result = await Car.find(filter).skip(skip).limit(limit).exec();

    return result;
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

    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = { addCar, getAll };
