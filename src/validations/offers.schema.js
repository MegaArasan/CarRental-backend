const Joi = require('joi');

const applyOfferSchema = Joi.object({
  bookingAmount: Joi.number().required().positive().messages({
    'any.required': 'bookingAmount is required',
    'number.base': 'bookingAmount must be a number',
    'number.positive': 'bookingAmount must be greater than 0'
  }),
  carId: Joi.string()
    .optional()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'carId must be a valid MongoDB ObjectId'
    }),
  rentalDays: Joi.number().required().integer().positive().messages({
    'any.required': 'rentalDays is required',
    'number.base': 'rentalDays must be a number',
    'number.integer': 'rentalDays must be an integer',
    'number.positive': 'rentalDays must be greater than 0'
  }),
  promoCode: Joi.string().optional()
});

module.exports = { applyOfferSchema };
