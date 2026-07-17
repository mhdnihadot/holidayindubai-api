"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const response_1 = require("../utils/response");
class BaseController {
    constructor(service, name = 'Document') {
        this.service = service;
        this.name = name;
        // Bind methods
        this.create = (0, catchAsync_1.default)(this.create.bind(this));
        this.getAll = (0, catchAsync_1.default)(this.getAll.bind(this));
        this.getById = (0, catchAsync_1.default)(this.getById.bind(this));
        this.update = (0, catchAsync_1.default)(this.update.bind(this));
        this.delete = (0, catchAsync_1.default)(this.delete.bind(this));
    }
    async create(req, res, next) {
        const doc = await this.service.create(req.body);
        (0, response_1.sendSuccess)(res, 201, `${this.name} created successfully`, doc);
    }
    async getAll(req, res, next) {
        const docs = await this.service.getAll(req.query);
        (0, response_1.sendSuccess)(res, 200, `${this.name}s retrieved successfully`, docs);
    }
    async getById(req, res, next) {
        const doc = await this.service.getById(req.params.id);
        (0, response_1.sendSuccess)(res, 200, `${this.name} retrieved successfully`, doc);
    }
    async update(req, res, next) {
        const doc = await this.service.update(req.params.id, req.body);
        (0, response_1.sendSuccess)(res, 200, `${this.name} updated successfully`, doc);
    }
    async delete(req, res, next) {
        await this.service.delete(req.params.id);
        (0, response_1.sendSuccess)(res, 204, `${this.name} deleted successfully`);
    }
}
exports.default = BaseController;
