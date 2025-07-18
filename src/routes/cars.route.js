const express = require('express');
const { getCars, add, editCar } = require('../controllers/car.controller');
const cachedMiddleware = require('../middlewares/redis.middleware');
const { validate, validateQuery } = require('../middlewares/joi.middleware');
const { addCarSchema, getCarSchema, editCarSchema } = require('../validations/car.schema');
const router = express.Router();

router.get('/', validateQuery(getCarSchema), cachedMiddleware, getCars);
router.post('/add', validate(addCarSchema), add);
router.put('/edit/:id', validate(editCarSchema), editCar);

module.exports = router;
