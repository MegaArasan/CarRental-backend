const express = require('express');
const { getCars } = require('../../src/controllers/car.controller');
const cachedMiddleware = require('../middlewares/redis.middleware');
const router = express.Router();

router.get('/getallcars', cachedMiddleware, getCars);

module.exports = router;
