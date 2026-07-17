"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseController_1 = __importDefault(require("../../core/BaseController"));
const admin_service_1 = __importDefault(require("./admin.service"));
const response_1 = require("../../utils/response");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const admin_dto_1 = __importDefault(require("./admin.dto"));
class AdminController extends BaseController_1.default {
    constructor() {
        super(admin_service_1.default, 'Admin');
        this.login = (0, catchAsync_1.default)(this.login.bind(this));
        this.logout = (0, catchAsync_1.default)(this.logout.bind(this));
        this.getProfile = (0, catchAsync_1.default)(this.getProfile.bind(this));
        this.updateProfile = (0, catchAsync_1.default)(this.updateProfile.bind(this));
        this.register = (0, catchAsync_1.default)(this.register.bind(this));
        this.refreshToken = (0, catchAsync_1.default)(this.refreshToken.bind(this));
        this.getAllUsers = (0, catchAsync_1.default)(this.getAllUsers.bind(this));
    }
    async register(req, res, next) {
        const admin = await this.service.register(req.body);
        (0, response_1.sendSuccess)(res, 201, 'Admin registered successfully', admin_dto_1.default.fromEntity(admin));
    }
    async login(req, res, next) {
        const data = await this.service.login(req.body.email, req.body.password);
        const isMobile = req.headers['is-mobile'] === 'true';
        if (isMobile) {
            (0, response_1.sendSuccess)(res, 200, 'Admin logged in successfully', {
                admin: admin_dto_1.default.fromEntity(data.admin),
                accessToken: data.accessToken,
                refreshToken: data.refreshToken
            });
        }
        else {
            res.cookie('refreshToken', data.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
            (0, response_1.sendSuccess)(res, 200, 'Admin logged in successfully', {
                admin: admin_dto_1.default.fromEntity(data.admin),
                token: data.accessToken
            });
        }
    }
    async refreshToken(req, res, next) {
        // Attempt to extract token from cookies or body
        const token = req.cookies?.refreshToken || req.body?.refreshToken;
        const data = await this.service.refreshToken(token);
        const isMobile = req.headers['is-mobile'] === 'true';
        if (isMobile) {
            (0, response_1.sendSuccess)(res, 200, 'Token refreshed successfully', {
                accessToken: data.accessToken,
                refreshToken: data.refreshToken
            });
        }
        else {
            res.cookie('refreshToken', data.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
            (0, response_1.sendSuccess)(res, 200, 'Token refreshed successfully', {
                token: data.accessToken
            });
        }
    }
    async logout(req, res, next) {
        await this.service.logout(req.token);
        (0, response_1.sendSuccess)(res, 200, 'Admin logged out successfully');
    }
    async getProfile(req, res, next) {
        const admin = await this.service.getProfile(req.user?.id);
        (0, response_1.sendSuccess)(res, 200, 'Profile retrieved successfully', admin_dto_1.default.fromEntity(admin));
    }
    async updateProfile(req, res, next) {
        const admin = await this.service.updateProfile(req.user?.id, req.body);
        (0, response_1.sendSuccess)(res, 200, 'Profile updated successfully', admin_dto_1.default.fromEntity(admin));
    }
    async getAllUsers(req, res, next) {
        const users = await this.service.getAllUsers();
        (0, response_1.sendSuccess)(res, 200, 'Users retrieved successfully', users);
    }
}
exports.default = new AdminController();
