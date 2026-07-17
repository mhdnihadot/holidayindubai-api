import { Request, Response, NextFunction } from 'express';
import BaseController from '../../core/BaseController';
import projectService from './project.service';
import { sendSuccess } from '../../utils/response';
import catchAsync from '../../utils/catchAsync';
import ProjectDTO from './project.dto';
import { IProject } from './project.interface';

class ProjectController extends BaseController<IProject> {
  constructor() {
    super(projectService, 'Project');
    this.createProject = catchAsync(this.createProject.bind(this));
    this.getAllProjects = catchAsync(this.getAllProjects.bind(this));
  }

  async createProject(req: Request, res: Response, next: NextFunction): Promise<void> {
    const project = await (this.service as any).createProject(req.body, req.user?.id);
    sendSuccess(res, 201, 'Project created successfully', ProjectDTO.fromEntity(project));
  }

  async getAllProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
    const projects = await (this.service as any).getAllProjects(req.query as any);
    sendSuccess(res, 200, 'Projects retrieved successfully', ProjectDTO.fromList(projects));
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    const project = await this.service.getById(req.params.id as string);
    sendSuccess(res, 200, 'Project retrieved successfully', ProjectDTO.fromEntity(project));
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    const project = await this.service.update(req.params.id as string, req.body);
    sendSuccess(res, 200, 'Project updated successfully', ProjectDTO.fromEntity(project));
  }
}

export default new ProjectController();
