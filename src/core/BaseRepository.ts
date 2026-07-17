import mongoose, { Document, Model, UpdateQuery } from 'mongoose';


class BaseRepository<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    return await this.model.create(data);
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id);
  }

  async findOne(query: any, select: string = ''): Promise<T | null> {
    return await this.model.findOne(query).select(select);
  }

  async find(query: any = {}, populate: string | null = null, select: string = '', sort: any = null): Promise<T[]> {
    let q = this.model.find(query).select(select);
    if (sort) q = q.sort(sort);
    if (populate) q = q.populate(populate) as any;
    return await q;
  }

  async updateById(id: string, data: UpdateQuery<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, data, {
      returnDocument: 'after',
      runValidators: true,
    });
  }

  async deleteById(id: string): Promise<T | null> {
    return await this.model.findByIdAndDelete(id);
  }

  async count(query: any = {}): Promise<number> {
    return await this.model.countDocuments(query);
  }
}

export default BaseRepository;
