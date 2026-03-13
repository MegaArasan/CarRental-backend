const redis = require('redis');
const logger = require('../config/logger');

let redisClient;
let redisInitPromise;

const createRedisClient = () => {
  if (redisClient) {
    return redisClient;
  }

  redisClient = redis.createClient({
    url: process.env.REDIS_URL || undefined,
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

  return redisClient;
};

const initRedis = async ({ optional = false } = {}) => {
  if (redisInitPromise) {
    return redisInitPromise;
  }

  if (!process.env.REDIS_URL && optional) {
    logger.warn('Redis disabled: REDIS_URL is not configured');
    return null;
  }

  const client = createRedisClient();
  if (client.isOpen) {
    return client;
  }

  redisInitPromise = client
    .connect()
    .then(() => {
      logger.info('Redis connected');
      return client;
    })
    .catch((err) => {
      redisInitPromise = null;
      logger.error('Redis connection failed', err);
      if (optional) {
        return null;
      }
      throw err;
    });

  return redisInitPromise;
};

const cachedMiddleware = async (req, res, next) => {
  if (req.method !== 'GET') {
    return next();
  }
  if (req.url.includes('/profile') || req.url.includes('/admin')) {
    return next();
  }
  if (!redisClient || !redisClient.isOpen) {
    return next();
  }

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
module.exports.initRedis = initRedis;
