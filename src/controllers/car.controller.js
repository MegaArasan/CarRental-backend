const {
  addCar,
  getAll,
  getCount,
  edit,
  getOne,
  deleteOne,
  getAllMakeDB
} = require('../services/car.service');

const getCars = async (req, res, next) => {
  try {
    const { page, limit, manufacturer, segment, id } = req.query;
    if (id) {
      const data = await getOne(id);

      return res.status(200).json({
        success: true,
        data
      });
    }
    const filter = {};
    if (manufacturer) {
      filter.manufacturer = manufacturer;
    }

    if (segment) {
      filter.segment = segment;
    }
    const cars = await getAll(filter, page, limit);
    const count = await getCount(filter, page, limit);

    const limitNum = limit || 10;
    const totalPages = Math.ceil(count / limitNum);
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

const editCar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const result = await edit(id, data);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Car not found or could not be updated'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Car updated successfully',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const deleteCar = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteOne(id);

    return res.status(200).json({ success: true, message: 'Car deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const getAllMakeAndModel = async (req, res, next) => {
  try {
    const manufacturers = await getAllMakeDB();
    res.status(200).json({ success: true, data: manufacturers });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCars,
  add,
  editCar,
  deleteCar,
  getAllMakeAndModel
};
