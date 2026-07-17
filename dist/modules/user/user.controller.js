"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseController_1 = __importDefault(require("../../core/BaseController"));
const user_service_1 = __importDefault(require("./user.service"));
const response_1 = require("../../utils/response");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const user_dto_1 = __importDefault(require("./user.dto"));
const AppError_1 = __importDefault(require("../../core/errors/AppError"));
class UserController extends BaseController_1.default {
    constructor() {
        super(user_service_1.default, 'User');
        this.register = (0, catchAsync_1.default)(this.register.bind(this));
        this.login = (0, catchAsync_1.default)(this.login.bind(this));
        this.logout = (0, catchAsync_1.default)(this.logout.bind(this));
        this.getProfile = (0, catchAsync_1.default)(this.getProfile.bind(this));
        this.updateProfile = (0, catchAsync_1.default)(this.updateProfile.bind(this));
        this.googleAuth = (0, catchAsync_1.default)(this.googleAuth.bind(this));
        this.appleAuth = (0, catchAsync_1.default)(this.appleAuth.bind(this));
        this.toggleWishlist = (0, catchAsync_1.default)(this.toggleWishlist.bind(this));
        this.getWishlist = (0, catchAsync_1.default)(this.getWishlist.bind(this));
    }
    async register(req, res, next) {
        const user = await this.service.register(req.body);
        (0, response_1.sendSuccess)(res, 201, 'User registered successfully', user_dto_1.default.fromEntity(user));
    }
    async login(req, res, next) {
        const data = await this.service.login(req.body.email, req.body.password);
        res.cookie('refreshToken', data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        (0, response_1.sendSuccess)(res, 200, 'User logged in successfully', {
            user: user_dto_1.default.fromEntity(data.user),
            token: data.accessToken
        });
    }
    async logout(req, res, next) {
        await this.service.logout(req.token);
        (0, response_1.sendSuccess)(res, 200, 'User logged out successfully');
    }
    async refreshToken(req, res, next) {
        const token = req.cookies?.refreshToken || req.body?.refreshToken;
        const data = await this.service.refreshToken(token);
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
    async getProfile(req, res, next) {
        const user = await this.service.getProfile(req.user?.id);
        (0, response_1.sendSuccess)(res, 200, 'Profile retrieved successfully', user_dto_1.default.fromEntity(user));
    }
    async updateProfile(req, res, next) {
        const user = await this.service.updateProfile(req.user?.id, req.body);
        (0, response_1.sendSuccess)(res, 200, 'Profile updated successfully', user_dto_1.default.fromEntity(user));
    }
    async googleAuth(req, res, next) {
        const data = await this.service.googleAuth(req.body);
        res.cookie('refreshToken', data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        (0, response_1.sendSuccess)(res, 200, 'User authenticated with Google successfully', {
            user: user_dto_1.default.fromEntity(data.user),
            token: data.accessToken
        });
    }
    async appleAuth(req, res, next) {
        const { identityToken, name } = req.body;
        if (!identityToken) {
            return next(new AppError_1.default('Identity token is required', 400));
        }
        try {
            const appleAuth = require('apple-signin-auth');
            const decoded = await appleAuth.verifyIdToken(identityToken, {
                ignoreExpiration: false,
            });
            const email = decoded.email;
            const appleId = decoded.sub;
            if (!email) {
                return next(new AppError_1.default('Email is required from Apple Sign-In', 400));
            }
            const data = await this.service.appleAuth({
                email,
                name: name || '',
                appleId,
            });
            res.cookie('refreshToken', data.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
            });
            (0, response_1.sendSuccess)(res, 200, 'User authenticated with Apple successfully', {
                user: user_dto_1.default.fromEntity(data.user),
                token: data.accessToken
            });
        }
        catch (error) {
            console.error('Apple Auth Error:', error);
            return next(new AppError_1.default('Invalid Apple Identity Token', 401));
        }
    }
    async toggleWishlist(req, res, next) {
        const user = await this.service.toggleWishlist(req.user?.id, req.params.projectId);
        (0, response_1.sendSuccess)(res, 200, 'Wishlist updated successfully', user_dto_1.default.fromEntity(user));
    }
    async getWishlist(req, res, next) {
        const wishlist = await this.service.getWishlist(req.user?.id);
        (0, response_1.sendSuccess)(res, 200, 'Wishlist retrieved successfully', wishlist);
    }
    async deleteAccount(req, res, next) {
        await this.service.deleteAccount(req.user?.id);
        (0, response_1.sendSuccess)(res, 200, 'Account deleted successfully', null);
    }
}
exports.default = new UserController();
