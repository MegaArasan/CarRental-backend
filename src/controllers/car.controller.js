const Car = require('../../src/models/carsModel');
const { addCar } = require('../services/car.service');

const getCars = async (req, res, next) => {
  try {
    const cars = await Car.find();
    res.status(200).json({ success: true, data: cars });
  } catch (e) {
    next(e);
  }
};

const add = async (req, res, next) => {
  const data = req.body;
  try {
    const result = await addCar(data);

    return res.status(201).json({ success: true, message: result });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCars,
  add
};
