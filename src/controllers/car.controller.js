const Car = require('../../src/models/carsModel');
const { addCar, getAll, getCount } = require('../services/car.service');

const getCars = async (req, res, next) => {
  try {
    const { page, limit, manufacturer, segment } = req.query;
    const filter = {};
    if (manufacturer) {
      filter.manufacturer = manufacturer;
    }

    if (segment) {
      filter.segment = segment;
    }
    const cars = await getAll(filter, page, limit);
    const count = await getCount(filter, page, limit);

    let limitNum = limit || 10;
    let totalPages = Math.ceil(count / limitNum);
    res.status(200).json({
      success: true,
      data: {
        totalCount: count,
        totalPages,
        cars
      }
    });
  } catch (e) {
    next(e);
  }
};

const add = async (req, res, next) => {
  const data = req.body;
  try {
    const result = await addCar(data);

    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCars,
  add
};
