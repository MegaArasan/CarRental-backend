require('dotenv').config();

const app = require('./src/app');
const { connectdb } = require('./src/config/db');
const logger = require('./src/config/logger');
const { startBookingExpiryJob } = require('./src/jobs/booking');
const { initRedis } = require('./src/middlewares/redis.middleware');

const PORT = process.env.PORT || 8000;

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception::', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:: ', err);
  process.exit(1);
});

async function startServer() {
  await connectdb();
  await initRedis({ optional: true });
  startBookingExpiryJob();

  app.listen(PORT, () => console.log(`server started in ${PORT}`));
}

startServer().catch((err) => {
  logger.error('Failed to start server', err);
  process.exit(1);
});
