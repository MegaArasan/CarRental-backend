const Car = require('../models/carsModel');

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
        city: '',
        state: '',
        country: ''
      }
    };

    const result = await Car.create(newCar);

    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = { addCar };
