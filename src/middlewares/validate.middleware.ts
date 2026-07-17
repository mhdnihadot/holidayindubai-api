import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import AppError from '../core/errors/AppError';

const validate = (schema: object) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validSchema = Joi.compile(schema);
    const object = Object.keys(schema).reduce((acc: any, key: string) => {
      if (Object.prototype.hasOwnProperty.call(req, key)) {
        acc[key] = (req as any)[key];
      }
      return acc;
    }, {});

    const { value, error } = validSchema.validate(object, {
      abortEarly: false,
      allowUnknown: true,
      stripUnknown: true,
    });

    if (error) {
      const errorMessage = error.details.map((details) => details.message).join(', ');
      return next(new AppError(errorMessage, 400));
    }
    
    Object.assign(req, value);
    return next();
  };
};

export default validate;
