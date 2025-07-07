const express = require('express');
const { getCars, add } = require('../controllers/car.controller');
const cachedMiddleware = require('../middlewares/redis.middleware');
const router = express.Router();

router.get('/getallcars', cachedMiddleware, getCars);
router.post('/add', add);

module.exports = router;
