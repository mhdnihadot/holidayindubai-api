import { Request, Response, NextFunction } from 'express';
import BaseService from './BaseService';
import catchAsync from '../utils/catchAsync';
import { sendSuccess } from '../utils/response';
import { Document } from 'mongoose';

class BaseController<T extends Document> {
  protected service: BaseService<T>;
  protected name: string;

  constructor(service: BaseService<T>, name: string = 'Document') {
    this.service = service;
    this.name = name;

    // Bind methods
    this.create = catchAsync(this.create.bind(this));
    this.getAll = catchAsync(this.getAll.bind(this));
    this.getById = catchAsync(this.getById.bind(this));
    this.update = catchAsync(this.update.bind(this));
    this.delete = catchAsync(this.delete.bind(this));
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const doc = await this.service.create(req.body);
    sendSuccess(res, 201, `${this.name} created successfully`, doc);
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    const docs = await this.service.getAll(req.query as any);
    sendSuccess(res, 200, `${this.name}s retrieved successfully`, docs);
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const doc = await this.service.getById(req.params.id as string);
    sendSuccess(res, 200, `${this.name} retrieved successfully`, doc);
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    const doc = await this.service.update(req.params.id as string, req.body);
    sendSuccess(res, 200, `${this.name} updated successfully`, doc);
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    await this.service.delete(req.params.id as string);
    sendSuccess(res, 204, `${this.name} deleted successfully`);
  }
}

export default BaseController;
