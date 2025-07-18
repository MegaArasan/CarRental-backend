const Joi = require('joi');

const getCarSchema = Joi.object({
  page: Joi.number().min(1).default(1).messages({
    'number.base': 'Page must be a number',
    'number.min': 'Page must be at least 1'
  }),
  limit: Joi.number().min(1).max(100).default(10).messages({
    'number.base': 'Limit must be a number',
    'number.min': 'Limit must be at least 1',
    'number.max': 'Limit cannot exceed 100'
  }),
  manufacturer: Joi.string().trim(),
  segment: Joi.string()
    .valid('Hatchback', 'Sedan', 'SUV', 'Luxury', 'MUV')
    .messages({
      'any.only': 'Segment must be one of Hatchback, Sedan, SUV, Luxury, or MUV',
      'string.base': 'Segment must be a string'
    })
    .trim()
});

const addCarSchema = Joi.object({
  manufacturer: Joi.string().required(),
  model: Joi.string().required(),
  variant: Joi.string().required(),
  transmission: Joi.string().valid('Manual', 'Automatic').required(),
  segment: Joi.string().valid('Hatchback', 'Sedan', 'SUV', 'Luxury', 'MUV').required(),
  image: Joi.string().required(),
  thumbnail: Joi.string().required(),
  capacity: Joi.number().min(2).max(10).required(),
  fuelType: Joi.string().valid('Petrol', 'Diesel', 'Electric', 'Hybrid').required(),
  rentPerHour: Joi.number().min(50).required(),
  status: Joi.string().valid('active', 'inactive').required(),
  location: Joi.object({
    city: Joi.string().required(),
    state: Joi.string().required(),
    country: Joi.string().required()
  }).required()
});

const editCarSchema = Joi.object({
  manufacturer: Joi.string(),
  model: Joi.string(),
  variant: Joi.string(),
  transmission: Joi.string().valid('Manual', 'Automatic'),
  segment: Joi.string().valid('Hatchback', 'Sedan', 'SUV', 'Luxury', 'MUV'),
  image: Joi.string(),
  thumbnail: Joi.string(),
  capacity: Joi.number().min(2).max(10),
  fuelType: Joi.string().valid('Petrol', 'Diesel', 'Electric', 'Hybrid'),
  rentPerHour: Joi.number().min(50),
  status: Joi.string().valid('active', 'inactive'),
  location: Joi.object({
    city: Joi.string(),
    state: Joi.string(),
    country: Joi.string()
  })
}).min(1); // Require at least one field to update

module.exports = { addCarSchema, getCarSchema, editCarSchema };
