import { createClient } from 'redis';
import { logger } from '../util/logger.js';

const redisConfig = {
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    connectTimeout: 5000,
    commandTimeout: 3000,
    reconnectDelay: 1000,
  },
  retry: {
    retries: 3,
    delay: (attempt) => Math.min(attempt * 50, 500),
  },
};

const client = createClient(redisConfig);

client.on('error', (err) => {
  logger.error('Redis Client Error:', err);
});

client.on('connect', () => {
  logger.info('Redis connected successfully');
});

client.on('reconnecting', () => {
  logger.warn('Redis reconnecting...');
});

try {
  await client.connect();
} catch (error) {
  logger.error('Failed to connect to Redis:', error);
}

export default client;
