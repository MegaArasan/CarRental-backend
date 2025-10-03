const Joi = require('joi');

// Simple ISO + YYYY-MM-DD regex
const isoOrDateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z)?$/;

const bookingSchema = Joi.object({
  user: Joi.object({
    _id: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneno: Joi.number().integer().required()
  }).required(),

  car: Joi.string().required(),

  totalHours: Joi.number().positive().required(),
  totalAmount: Joi.number().positive().required(),
  finalAmount: Joi.number().positive().optional(), // amount after discount
  driverRequired: Joi.boolean().required(),
  offerApplied: Joi.string().optional(),

  bookedTimeSlots: Joi.object({
    from: Joi.string()
      .required()
      .custom((value, helpers) => {
        const date = new Date(value);
        if (isNaN(date)) {
          return helpers.error('any.invalid');
        }
        return value;
      }, 'Date validation'),

    to: Joi.string()
      .required()
      .custom((value, helpers) => {
        const date = new Date(value);
        if (isNaN(date)) {
          return helpers.error('any.invalid');
        }
        return value;
      }, 'Date validation')
  }).required(),

  // NEW Pickup & Drop Fields
  pickupLocation: Joi.string().when('driverRequired', { is: true, then: Joi.required() }),
  dropLocation: Joi.string().when('driverRequired', { is: true, then: Joi.required() }),
  pickupDate: Joi.string()
    .required()
    .custom((value, helpers) => {
      const date = new Date(value);
      if (isNaN(date)) {
        return helpers.error('any.invalid');
      }
      return value;
    }, 'Date validation')
    .when('driverRequired', { is: true, then: Joi.required() }),
  dropDate: Joi.string()
    .required()
    .custom((value, helpers) => {
      const date = new Date(value);
      if (isNaN(date)) {
        return helpers.error('any.invalid');
      }
      return value;
    }, 'Date validation')
    .when('driverRequired', { is: true, then: Joi.required() })
});

const getBookingQuerySchema = Joi.object({
  status: Joi.string().valid('pending', 'confirmed', 'cancelled').optional(),

  from: Joi.string().pattern(isoOrDateRegex).optional().messages({
    'date.format': '"from" must be in YYYY-MM-DD format'
  }),

  to: Joi.string().pattern(isoOrDateRegex).optional().messages({
    'date.format': '"to" must be a valid ISO date'
  })
})
  .custom((value, helpers) => {
    if (value.from && value.to && new Date(value.to) < new Date(value.from)) {
      return helpers.message('"to" must be greater than "from"');
    }
    return value;
  })
  .strict();

module.exports = { bookingSchema, getBookingQuerySchema };
