const express = require('express');
const { exploreData } = require('../controllers/explore.controller');
const { validate } = require('../middlewares/joi.middleware');
const { exploreFilterSchema } = require('../validations/explore.schema');
const route = express.Router();

route.get('/', validate(exploreFilterSchema), exploreData);

module.exports = route;
