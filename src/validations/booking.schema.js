const Joi = require('joi');

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
  driverRequired: Joi.boolean().required(),

  bookedTimeSlots: Joi.object({
    from: Joi.string()
      .required()
      .custom((value, helpers) => {
        const date = new Date(value);
        if (isNaN(date)) return helpers.error('any.invalid');
        return value;
      }, 'Date validation'),

    to: Joi.string()
      .required()
      .custom((value, helpers) => {
        const date = new Date(value);
        if (isNaN(date)) return helpers.error('any.invalid');
        return value;
      }, 'Date validation')
  }).required()
});

const getBookingQuerySchema = Joi.object({
  status: Joi.string().valid('pending', 'confirmed', 'cancelled').optional(),

  from: Joi.date().optional().messages({
    'date.format': '"from" must be a valid ISO date'
  }),

  to: Joi.date().optional().messages({
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
