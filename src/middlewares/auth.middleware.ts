import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import AppError from '../core/errors/AppError';
import catchAsync from '../utils/catchAsync';
import { redisClient } from '../config/redis';

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // Check if token is blacklisted in Redis
  const isBlacklisted = await redisClient.get(`bl_${token}`);
  if (isBlacklisted) {
    return next(new AppError('Token is no longer valid. Please log in again.', 401));
  }

  // Verify token
  try {
    const decoded: any = verifyToken(token);
    req.user = decoded;
    req.token = token;
    next();
  } catch (err) {
    return next(new AppError('Invalid token. Please log in again.', 401));
  }
});

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};
