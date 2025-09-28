const Joi = require('joi');

const paymentHistorySchema = Joi.object({
  userId: Joi.string().required().messages({
    'any.required': 'userId is required',
    'string.empty': 'userId cannot be empty'
  }),

  status: Joi.string().valid('pending', 'completed', 'failed'),

  paymentMode: Joi.string().valid('Card', 'UPI', 'NetBanking', 'Wallet'),

  refundStatus: Joi.string().valid('pending', 'processed', 'failed'),

  transactionId: Joi.string(),

  orderId: Joi.string(),

  startDate: Joi.date().iso(),
  endDate: Joi.date().iso().greater(Joi.ref('startDate')).messages({
    'date.greater': 'endDate must be greater than startDate'
  }),

  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),

  sort: Joi.string()
    .pattern(/^[-+]?(createdAt|amount|status)$/)
    .default('-createdAt')
});

module.exports = { paymentHistorySchema };
