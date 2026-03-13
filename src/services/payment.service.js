const logger = require('../config/logger');
const ErrorResponse = require('../errors/errorResponse');
const paymentModel = require('../models/paymentModel');
const { getUserDtl } = require('./user.service');

const getPaymentHistory = async (userId, filter = {}) => {
  const user = await getUserDtl(userId);
  if (!user) {
    throw new ErrorResponse(404, 'User Not Found');
  }

  // Merge userId into filter query
  const query = { user: userId, ...filter };

  const result = await paymentModel.find(query).lean();
  return result;
};

const insertPaymentHistory = async (orderId, user, amount) => {
  try {
    const paymentreq = {
      orderId,
      status: 'pending',
      user: user.userId,
      amount,
      currency: 'INR'
    };

    await paymentModel.create(paymentreq);
  } catch (e) {
    logger.error(e);
  }
};

const updatePaymentHistory = async (orderId, updateFields) => {
  try {
    // Only allow specific fields to update
    const allowedFields = [
      'status',
      'paymentMode',
      'gatewayResponse',
      'refundStatus',
      'transactionId',
      'amount'
    ];
    const updateData = {};
    allowedFields.forEach((field) => {
      if (updateFields[field] !== undefined) {
        updateData[field] = updateFields[field];
      }
    });

    await paymentModel.updateOne({ orderId }, { $set: updateData });
  } catch (error) {
    logger.error(error);
  }
};

module.exports = { getPaymentHistory, insertPaymentHistory, updatePaymentHistory };
