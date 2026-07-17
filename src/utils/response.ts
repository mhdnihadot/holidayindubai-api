import { Response } from 'express';

export const sendSuccess = (res: Response, statusCode: number, message: string, data: any = null) => {
  const response: any = {
    status: 'success',
    message,
  };
  if (data !== null) {
    response.data = data;
  }
  return res.status(statusCode).json(response);
};

export const sendError = (res: Response, statusCode: number, message: string) => {
  return res.status(statusCode).json({
    status: 'fail',
    message,
  });
};
