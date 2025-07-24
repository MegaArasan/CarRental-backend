const redis = require('redis');
const logger = require('../config/logger');

let redisClient = redis.createClient({
  socket: {
    connectTimeout: 10000,
    reconnectStrategy: (retries) => {
      const jitter = Math.floor(Math.random() * 100);
      const delay = Math.min(Math.pow(2, retries) * 50, 3000);
      return delay + jitter;
    }
  }
});

redisClient.on('error', (error) => logger.error(`Redis Error: ${error}`));

(async () => {
  try {
    await redisClient.connect();
    logger.info('✅ Redis connected');
  } catch (err) {
    logger.error('❌ Redis connection failed:', err);
    process.exit(1);
  }
})();

const cachedMiddleware = async (req, res, next) => {
  if (req.method !== 'GET') return next();
  if (req.url.includes('/profile') || req.url.includes('/admin')) return next();

  const key = `cache:${req.url}`;

  let cached;
  try {
    cached = await redisClient.get(key);
  } catch (err) {
    logger.error('Redis GET error:', err);
    return next();
  }

  if (cached) {
    res.set('X-Cache-Hit', 'true');
    res.set('Cache-Control', 'public, max-age=60');
    return res.status(200).json({
      ...JSON.parse(cached),
      cached: true
    });
  }
  res.sendResponse = res.json;
  res.json = async (body) => {
    if (res.statusCode === 200) {
      try {
        const payload = typeof body.toJSON === 'function' ? body.toJSON() : body;
        await redisClient.del(key);
        await redisClient.setEx(key, 60, JSON.stringify(payload));
      } catch (e) {
        logger.error('Redis SET error:', e);
      }
    }

    res.sendResponse(body);
  };

  next();
};

module.exports = cachedMiddleware;
