"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("./errors/AppError"));
class BaseService {
    constructor(repository) {
        this.repository = repository;
    }
    async create(data) {
        return await this.repository.create(data);
    }
    async getById(id) {
        const doc = await this.repository.findById(id);
        if (!doc) {
            throw new AppError_1.default('Document not found with that ID', 404);
        }
        return doc;
    }
    async getAll(query = {}) {
        return await this.repository.find(query);
    }
    async update(id, data) {
        const doc = await this.repository.updateById(id, data);
        if (!doc) {
            throw new AppError_1.default('Document not found with that ID', 404);
        }
        return doc;
    }
    async delete(id) {
        const doc = await this.repository.deleteById(id);
        if (!doc) {
            throw new AppError_1.default('Document not found with that ID', 404);
        }
        return doc;
    }
}
exports.default = BaseService;
