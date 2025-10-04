const Joi = require('joi');
const mongoose = require('mongoose');

const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message('"{{#label}}" must be a valid ObjectId');
  }
  return value;
};

const applyOfferSchema = Joi.object({
  bookingAmount: Joi.number().required().positive().messages({
    'any.required': 'bookingAmount is required',
    'number.base': 'bookingAmount must be a number',
    'number.positive': 'bookingAmount must be greater than 0'
  }),
  carId: Joi.string().custom(objectId).required(),
  rentalDays: Joi.number().required().integer().positive().messages({
    'any.required': 'rentalDays is required',
    'number.base': 'rentalDays must be a number',
    'number.integer': 'rentalDays must be an integer',
    'number.positive': 'rentalDays must be greater than 0'
  }),
  promoCode: Joi.string().optional()
});

// Params validation
const offerIdParam = Joi.object({
  id: Joi.string().custom(objectId).required()
});

// Body for creation
const createOfferSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  discountType: Joi.string().valid('flat', 'percentage').required(),
  discountValue: Joi.number().required(),
  carIds: Joi.array().items(Joi.string().custom(objectId)).optional(),
  isGlobal: Joi.boolean().default(false),
  minDays: Joi.number().default(0),
  promoCode: Joi.string().allow(null).optional(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  isActive: Joi.boolean().default(true)
}).custom((value, helpers) => {
  if (value.startDate && value.endDate && value.startDate > value.endDate) {
    return helpers.message('"startDate" must be before "endDate"');
  }
  if (!value.isGlobal && (!value.carIds || value.carIds.length === 0)) {
    return helpers.message('If "isGlobal" is false, "carIds" must be provided');
  }
  return value;
});

// Body for update (partial)
const updateOfferSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  discountType: Joi.string().valid('flat', 'percentage').optional(),
  discountValue: Joi.number().optional(),
  carIds: Joi.array().items(Joi.string().custom(objectId)).optional(),
  isGlobal: Joi.boolean().optional(),
  minDays: Joi.number().optional(),
  promoCode: Joi.string().allow(null).optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  isActive: Joi.boolean().optional()
}).custom((value, helpers) => {
  if (value.startDate && value.endDate && value.startDate > value.endDate) {
    return helpers.message('"startDate" must be before "endDate"');
  }
  if (value.isGlobal === false && (!value.carIds || value.carIds.length === 0)) {
    return helpers.message('If "isGlobal" is false, "carIds" must be provided');
  }
  return value;
});

module.exports = { applyOfferSchema, offerIdParam, createOfferSchema, updateOfferSchema };
