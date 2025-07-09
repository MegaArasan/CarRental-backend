const express = require('express');
const { getCars, add } = require('../controllers/car.controller');
const cachedMiddleware = require('../middlewares/redis.middleware');
const { validate, validateQuery } = require('../middlewares/joi.middleware');
const { addCar, getCar } = require('../validations/car.schema');
const router = express.Router();

router.get('/', validateQuery(getCar), cachedMiddleware, getCars);
router.post('/add', validate(addCar), add);

module.exports = router;
