const { getPaymentHistory } = require('../services/payment.service');

const paymentHistory = async (req, res, next) => {
  try {
    const {
      userId,
      status,
      paymentMode,
      refundStatus,
      transactionId,
      orderId,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sort = '-createdAt'
    } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId is required' });
    }

    const filter = {};
    if (status) {
      filter.status = status;
    }
    if (paymentMode) {
      filter.paymentMode = paymentMode;
    }
    if (refundStatus) {
      filter.refundStatus = refundStatus;
    }
    if (transactionId) {
      filter.transactionId = transactionId;
    }
    if (orderId) {
      filter.orderId = orderId;
    }
    if (startDate && endDate) {
      filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const data = await getPaymentHistory(userId, filter, { page, limit, sort });

    return res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

module.exports = { paymentHistory };
