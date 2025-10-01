const Joi = require('joi');

const loginSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().min(8).required()
});

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  address: Joi.string().required(),
  phoneno: Joi.string().required(),
  username: Joi.string().required()
});

const editProfileSchema = Joi.object({
  email: Joi.string().email().allow(''),
  address: Joi.string().allow(''),
  phoneno: Joi.string().allow(''),
  username: Joi.string().allow(''),
  profile: Joi.string().allow('')
}).min(1);

module.exports = {
  loginSchema,
  registerSchema,
  editProfileSchema
};
