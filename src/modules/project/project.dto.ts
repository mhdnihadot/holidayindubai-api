import { IProject } from './project.interface';

class ProjectDTO {
  public id: string;
  public title: string;
  public subtitle?: string;
  public description: string;
  public location?: string;
  public googleMapUrl?: string;
  public emirate?: string;
  public category?: string;
  public duration?: string;
  public bestTime?: string;
  public bestSeason?: string;
  public outdoor?: boolean;
  public highlights?: { icon: string; text: string }[];
  public idealFor?: { icon: string; text: string }[];
  public distanceFromCity?: string;
  public nearbyLandmarks?: string[];
  public dressCode?: { recommended?: string; avoid?: string };
  public safetyAndComfort?: { icon: string; title: string; description: string }[];
  public accessibility?: { icon: string; title: string; description: string }[];
  public experienceSteps?: { title: string; content: string }[];
  public platformUrl?: string;
  public status: string;
  public images: string[];
  public createdBy: any;
  public createdAt: Date;

  constructor(project: IProject) {
    this.id = project._id.toString();
    this.title = project.title;
    this.subtitle = project.subtitle;
    this.description = project.description;
    this.location = project.location;
    this.googleMapUrl = project.googleMapUrl;
    this.emirate = project.emirate;
    this.category = project.category;
    this.duration = project.duration;
    this.bestTime = project.bestTime;
    this.bestSeason = project.bestSeason;
    this.outdoor = project.outdoor;
    this.highlights = project.highlights;
    this.idealFor = project.idealFor;
    this.distanceFromCity = project.distanceFromCity;
    this.nearbyLandmarks = project.nearbyLandmarks;
    this.dressCode = project.dressCode;
    this.safetyAndComfort = project.safetyAndComfort;
    this.accessibility = project.accessibility;
    this.experienceSteps = project.experienceSteps;
    this.platformUrl = project.platformUrl;
    this.status = project.status;
    this.images = project.images;
    this.createdBy = project.createdBy;
    this.createdAt = project.createdAt;
  }

  static fromEntity(project: IProject | null): ProjectDTO | null {
    if (!project) return null;
    return new ProjectDTO(project);
  }

  static fromList(projects: IProject[]): ProjectDTO[] {
    if (!projects || !Array.isArray(projects)) return [];
    return projects.map(project => new ProjectDTO(project));
  }
}

export default ProjectDTO;
