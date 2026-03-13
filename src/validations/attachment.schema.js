const Joi = require('joi');

const fileSchema = Joi.object({
  originalname: Joi.string().required(),
  mimetype: Joi.string().valid('image/jpeg', 'image/png', 'application/pdf').required(),
  size: Joi.number()
    .max(5 * 1024 * 1024)
    .required()
});

const addSchema = Joi.object({
  type: Joi.string().valid('User', 'Car', 'Booking').required(),
  files: Joi.array().items(fileSchema)
});

module.exports = { addSchema };
