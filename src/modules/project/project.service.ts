import BaseService from '../../core/BaseService';
import projectRepository from './project.repository';
import { IProject } from './project.interface';
import mongoose, { Document, Model, UpdateQuery } from 'mongoose';


class ProjectService extends BaseService<IProject> {
  constructor() {
    super(projectRepository);
  }

  async getAllProjects(query: any): Promise<IProject[]> {
    const filter = { ...query };
    if (filter.category) {
      filter.category = { $regex: filter.category, $options: 'i' };
    }
    return await this.repository.find(filter, 'createdBy', '', { createdAt: -1 });
  }

  async createProject(data: Partial<IProject>, adminId: string): Promise<IProject> {
    data.createdBy = adminId as any;
    return await this.create(data);
  }
}

export default new ProjectService();
