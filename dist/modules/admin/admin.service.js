"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseService_1 = __importDefault(require("../../core/BaseService"));
const admin_repository_1 = __importDefault(require("./admin.repository"));
const AppError_1 = __importDefault(require("../../core/errors/AppError"));
const jwt_1 = require("../../utils/jwt");
const env_1 = __importDefault(require("../../config/env"));
const redis_1 = require("../../config/redis");
const user_model_1 = __importDefault(require("../user/user.model"));
class AdminService extends BaseService_1.default {
    constructor() {
        super(admin_repository_1.default);
    }
    async register(data) {
        const existingAdmin = await this.repository.findByEmail(data.email);
        if (existingAdmin) {
            throw new AppError_1.default('Email already exists', 400);
        }
        const admin = await this.repository.create({
            name: data.name,
            email: data.email,
            password: data.password
        });
        admin.password = undefined;
        return admin;
    }
    async login(email, password) {
        const admin = await this.repository.findByEmail(email, true);
        if (!admin || !(await admin.correctPassword(password, admin.password))) {
            throw new AppError_1.default('Incorrect email or password', 401);
        }
        const payload = { id: admin._id.toString(), role: admin.role };
        const accessToken = (0, jwt_1.signToken)(payload, env_1.default.jwtExpiresIn);
        const refreshToken = (0, jwt_1.signToken)(payload, env_1.default.jwtRefreshExpiresIn);
        admin.password = undefined;
        return { admin, accessToken, refreshToken };
    }
    async refreshToken(token) {
        if (!token)
            throw new AppError_1.default('Refresh token is required', 401);
        let decoded;
        try {
            decoded = (0, jwt_1.verifyToken)(token);
        }
        catch (err) {
            throw new AppError_1.default('Invalid refresh token', 401);
        }
        const admin = await this.getById(decoded.id);
        if (!admin) {
            throw new AppError_1.default('Admin no longer exists', 401);
        }
        const payload = { id: admin._id.toString(), role: admin.role };
        const accessToken = (0, jwt_1.signToken)(payload, env_1.default.jwtExpiresIn);
        const newRefreshToken = (0, jwt_1.signToken)(payload, env_1.default.jwtRefreshExpiresIn);
        return { accessToken, refreshToken: newRefreshToken };
    }
    async logout(token) {
        await redis_1.redisClient.setEx(`bl_${token}`, 60 * 60 * 24, 'blacklisted');
        return true;
    }
    async getProfile(adminId) {
        return await this.getById(adminId);
    }
    async updateProfile(adminId, updateData) {
        delete updateData.password;
        delete updateData.role;
        return await this.update(adminId, updateData);
    }
    async getAllUsers() {
        return await user_model_1.default.find().select('-password -__v').sort({ createdAt: -1 });
    }
}
exports.default = new AdminService();
