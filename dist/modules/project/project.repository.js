"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRepository_1 = __importDefault(require("../../core/BaseRepository"));
const project_model_1 = __importDefault(require("./project.model"));
class ProjectRepository extends BaseRepository_1.default {
    constructor() {
        super(project_model_1.default);
    }
}
exports.default = new ProjectRepository();
