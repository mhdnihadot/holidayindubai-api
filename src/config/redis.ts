import { createClient } from 'redis';
import env from './env';
import logger from '../utils/logger';

const redisClient = createClient({
  url: env.redisUrl
});

redisClient.on('error', (err: Error) => logger.error(`Redis Client Error: ${err.message}`));
redisClient.on('connect', () => logger.info('Redis Connected'));

const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();
  } catch (err: any) {
    logger.error(`Could not connect to Redis: ${err.message}`);
  }
};

export { redisClient, connectRedis };
