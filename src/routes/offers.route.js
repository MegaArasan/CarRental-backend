const express = require('express');
const { get, apply, create, update, offerDelete } = require('../controllers/offers.controller');
const { validate, validateParams } = require('../middlewares/joi.middleware');
const {
  applyOfferSchema,
  createOfferSchema,
  offerIdParam,
  updateOfferSchema
} = require('../validations/offers.schema');

const route = express.Router();

route.get('/', get);
route.post('/apply', validate(applyOfferSchema), apply);
route.post('/', validate(createOfferSchema), create);
route.put('/:id', validateParams(offerIdParam), validate(updateOfferSchema), update);
route.delete('/:id', validateParams(offerIdParam), offerDelete);

module.exports = route;
