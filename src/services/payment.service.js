const ErrorResponse = require('../errors/errorResponse');
const paymentModel = require('../models/paymentModel');
const { getUserDtl } = require('./user.service');

const getPaymentHistory = async (userId, filter = {}) => {
  try {
    const user = await getUserDtl(userId);
    if (!user) {
      throw new ErrorResponse(404, 'User Not Found');
    }

    // Merge userId into filter query
    const query = { user: userId, ...filter };

    const result = await paymentModel.find(query).lean();
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = { getPaymentHistory };
