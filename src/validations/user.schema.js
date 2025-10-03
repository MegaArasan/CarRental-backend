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
  email: Joi.string().email().trim().optional().messages({
    'string.email': 'Invalid email format'
  }),
  address: Joi.string().trim().optional(),
  phoneno: Joi.string()
    .trim()
    .pattern(/^[0-9]{10,15}$/)
    .optional()
    .messages({
      'string.pattern.base': 'Phone number must be 10-15 digits'
    }),
  username: Joi.string().trim().optional(),
  profile: Joi.string().trim().optional()
})
  .min(1) // At least one field must be present
  .unknown(false); // Disallow unknown fields

module.exports = {
  loginSchema,
  registerSchema,
  editProfileSchema
};
