const cron = require('node-cron');

const Booking = require('../../src/models/bookingModel');
const logger = require('../config/logger');

cron.schedule('*/5 * * * *', async () => {
  const now = new Date();
  logger.info(now);
  try {
    const expired = await Booking.find({
      status: 'pending',
      expiresAt: { $lt: now }
    });
    logger.info(expired);
    for (const booking of expired) {
      booking.status = 'cancelled';
      await booking.save();
      logger.info('Cancelled expired booking');
    }
  } catch (e) {
    logger.error(e);
  }
});
