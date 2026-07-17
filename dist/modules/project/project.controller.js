"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseController_1 = __importDefault(require("../../core/BaseController"));
const project_service_1 = __importDefault(require("./project.service"));
const response_1 = require("../../utils/response");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const project_dto_1 = __importDefault(require("./project.dto"));
class ProjectController extends BaseController_1.default {
    constructor() {
        super(project_service_1.default, 'Project');
        this.createProject = (0, catchAsync_1.default)(this.createProject.bind(this));
        this.getAllProjects = (0, catchAsync_1.default)(this.getAllProjects.bind(this));
    }
    async createProject(req, res, next) {
        const project = await this.service.createProject(req.body, req.user?.id);
        (0, response_1.sendSuccess)(res, 201, 'Project created successfully', project_dto_1.default.fromEntity(project));
    }
    async getAllProjects(req, res, next) {
        const projects = await this.service.getAllProjects(req.query);
        (0, response_1.sendSuccess)(res, 200, 'Projects retrieved successfully', project_dto_1.default.fromList(projects));
    }
    async getById(req, res, next) {
        const project = await this.service.getById(req.params.id);
        (0, response_1.sendSuccess)(res, 200, 'Project retrieved successfully', project_dto_1.default.fromEntity(project));
    }
    async update(req, res, next) {
        const project = await this.service.update(req.params.id, req.body);
        (0, response_1.sendSuccess)(res, 200, 'Project updated successfully', project_dto_1.default.fromEntity(project));
    }
}
exports.default = new ProjectController();
