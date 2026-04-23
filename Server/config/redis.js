const Redis = require('ioredis');

const logger = require('../utils/logger');

let redisClient;

const connectRedis = async () => {
  if (!process.env.REDIS_URL) {
    logger.warn('REDIS_URL not configured. Continuing without Redis.');
    return null;
  }

  if (redisClient) {
    return redisClient;
  }

  redisClient = new Redis(process.env.REDIS_URL, {
    lazyConnect: true,
    maxRetriesPerRequest: 1,
  });

  redisClient.on('error', (error) => {
    logger.error(`Redis error: ${error.message}`);
  });

  await redisClient.connect();
  logger.info('Redis connected successfully.');

  return redisClient;
};

const getRedisClient = () => redisClient;

const closeRedis = async () => {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
};

module.exports = {
  connectRedis,
  getRedisClient,
  closeRedis,
};
