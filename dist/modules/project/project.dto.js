"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProjectDTO {
    constructor(project) {
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
    static fromEntity(project) {
        if (!project)
            return null;
        return new ProjectDTO(project);
    }
    static fromList(projects) {
        if (!projects || !Array.isArray(projects))
            return [];
        return projects.map(project => new ProjectDTO(project));
    }
}
exports.default = ProjectDTO;
