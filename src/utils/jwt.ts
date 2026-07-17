import jwt from 'jsonwebtoken';
import env from '../config/env';

export const signToken = (payload: object, expiresIn: string | number): string => {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: expiresIn as any });
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, env.jwtSecret);
};
