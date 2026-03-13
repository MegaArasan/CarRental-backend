require('dotenv').config();

const app = require('../src/app');
const { connectdb } = require('../src/config/db');
const { initRedis } = require('../src/middlewares/redis.middleware');

let initialized = false;

module.exports = async (req, res) => {
  await connectdb();

  if (!initialized) {
    await initRedis({ optional: true });
    initialized = true;
  }

  return app(req, res);
};
