import { Request, Response, NextFunction } from 'express';

const catchAsync = (fn: Function): any => {
  return (req: any, res: any, next: any) => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
