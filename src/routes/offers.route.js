const express = require('express');
const { get, apply } = require('../controllers/offers.controller');
const { validate } = require('../middlewares/joi.middleware');
const { applyOfferSchema } = require('../validations/offers.schema');

const route = express.Router();

route.get('/', get);
route.post('/apply', validate(applyOfferSchema), apply);

module.exports = route;
