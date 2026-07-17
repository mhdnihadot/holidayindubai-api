import BaseRepository from '../../core/BaseRepository';
import Project from './project.model';
import { IProject } from './project.interface';

class ProjectRepository extends BaseRepository<IProject> {
  constructor() {
    super(Project);
  }
}

export default new ProjectRepository();
