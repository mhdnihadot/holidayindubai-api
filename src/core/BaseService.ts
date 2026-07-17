import BaseRepository from './BaseRepository';
import AppError from './errors/AppError';
import mongoose, { Document, Model, UpdateQuery } from 'mongoose';


class BaseService<T extends Document> {
  protected repository: BaseRepository<T>;

  constructor(repository: BaseRepository<T>) {
    this.repository = repository;
  }

  async create(data: Partial<T>): Promise<T> {
    return await this.repository.create(data);
  }

  async getById(id: string): Promise<T> {
    const doc = await this.repository.findById(id);
    if (!doc) {
      throw new AppError('Document not found with that ID', 404);
    }
    return doc;
  }

  async getAll(query: any = {}): Promise<T[]> {
    return await this.repository.find(query);
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const doc = await this.repository.updateById(id, data);
    if (!doc) {
      throw new AppError('Document not found with that ID', 404);
    }
    return doc;
  }

  async delete(id: string): Promise<T> {
    const doc = await this.repository.deleteById(id);
    if (!doc) {
      throw new AppError('Document not found with that ID', 404);
    }
    return doc;
  }
}

export default BaseService;
