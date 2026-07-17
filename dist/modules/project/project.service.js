"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseService_1 = __importDefault(require("../../core/BaseService"));
const project_repository_1 = __importDefault(require("./project.repository"));
class ProjectService extends BaseService_1.default {
    constructor() {
        super(project_repository_1.default);
    }
    async getAllProjects(query) {
        const filter = { ...query };
        if (filter.category) {
            filter.category = { $regex: filter.category, $options: 'i' };
        }
        return await this.repository.find(filter, 'createdBy', '', { createdAt: -1 });
    }
    async createProject(data, adminId) {
        data.createdBy = adminId;
        return await this.create(data);
    }
}
exports.default = new ProjectService();
