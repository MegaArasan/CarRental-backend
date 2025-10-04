const express = require('express');
const { getCars, add, editCar, deleteCar } = require('../controllers/car.controller');
const cachedMiddleware = require('../middlewares/redis.middleware');
const { validate, validateQuery, validateParams } = require('../middlewares/joi.middleware');
const {
  addCarSchema,
  getCarSchema,
  editCarSchema,
  deleteCarSchema,
  editCarParamsSchema
} = require('../validations/car.schema');
const router = express.Router();

router.get('/', validateQuery(getCarSchema), cachedMiddleware, getCars);
router.post('/add', validate(addCarSchema), add);
router.put('/edit/:id', validateParams(editCarParamsSchema), validate(editCarSchema), editCar);
router.delete('/:id', validateParams(deleteCarSchema), deleteCar);

module.exports = router;
