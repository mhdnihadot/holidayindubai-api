import app from './app';
import env from './config/env';
import connectDB from './config/db';
import { connectRedis } from './config/redis';
import logger from './utils/logger';

process.on('uncaughtException', (err: Error) => {
  logger.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  logger.error(`${err.name}: ${err.message}`);
  process.exit(1);
});

// Initialize Server
const startServer = async () => {
  // Connect to databases
  await connectDB();
  await connectRedis();

  const server = app.listen(env.port, () => {
    logger.info(`App running on port ${env.port}...`);
  });

  process.on('unhandledRejection', (err: Error) => {
    logger.error('UNHANDLED REJECTION! 💥 Shutting down...');
    logger.error(`${err.name}: ${err.message}`);
    server.close(() => {
      process.exit(1);
    });
  });
};

startServer();
