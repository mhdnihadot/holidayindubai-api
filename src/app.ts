import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { authLimiter, apiLimiter } from './middlewares/rateLimiter.middleware';
import globalErrorHandler from './middlewares/error.middleware';
import AppError from './core/errors/AppError';
import env from './config/env';

// Routes
import userRoutes from './modules/user/user.routes';
import adminRoutes from './modules/admin/admin.routes';
import projectRoutes from './modules/project/project.routes';

const app: Application = express();

// Security HTTP headers
app.use(helmet());

// Request logging
app.use(morgan(env.nodeEnv === 'development' ? 'dev' : 'combined'));

// CORS configuration
const corsOptions = {
  origin: env.nodeEnv === 'production' 
    ? (env.corsOrigin ? env.corsOrigin.split(',').map(o => o.trim()) : []) 
    : true, // Use `true` to reflect origin, as '*' is not allowed with credentials: true
  credentials: true,
};
app.use(cors(corsOptions));

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Limit requests from same API (Production Only)
if (env.nodeEnv === 'production') {
  app.use('/api', apiLimiter);
  app.use('/api/v1/user/login', authLimiter);
  app.use('/api/v1/user/register', authLimiter);
  app.use('/api/v1/admin/login', authLimiter);
}

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/project', projectRoutes);

// Handle undefined Routes
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
