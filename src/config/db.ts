import mongoose from 'mongoose';
import env from './env';
import logger from '../utils/logger';

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.mongoUri);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
