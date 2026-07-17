"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const google_auth_library_1 = require("google-auth-library");
const BaseService_1 = __importDefault(require("../../core/BaseService"));
const user_repository_1 = __importDefault(require("./user.repository"));
const AppError_1 = __importDefault(require("../../core/errors/AppError"));
const jwt_1 = require("../../utils/jwt");
const env_1 = __importDefault(require("../../config/env"));
const redis_1 = require("../../config/redis");
const googleClient = new google_auth_library_1.OAuth2Client(env_1.default.googleClientId);
class UserService extends BaseService_1.default {
    constructor() {
        super(user_repository_1.default);
    }
    async register(data) {
        const existingUser = await this.repository.findByEmail(data.email);
        if (existingUser) {
            throw new AppError_1.default('Email already exists', 400);
        }
        const user = await this.repository.create({
            name: data.name,
            email: data.email,
            password: data.password
        });
        user.password = undefined;
        return user;
    }
    async login(email, password) {
        const user = await this.repository.findByEmail(email, true);
        if (!user || !(await user.correctPassword(password, user.password))) {
            throw new AppError_1.default('Incorrect email or password', 401);
        }
        const payload = { id: user._id, role: user.role };
        const accessToken = (0, jwt_1.signToken)(payload, env_1.default.jwtExpiresIn);
        const refreshToken = (0, jwt_1.signToken)(payload, env_1.default.jwtRefreshExpiresIn);
        user.password = undefined;
        return { user, accessToken, refreshToken };
    }
    async logout(token) {
        await redis_1.redisClient.setEx(`bl_${token}`, 60 * 60 * 24, 'blacklisted');
        return true;
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
        const user = await this.getById(decoded.id);
        if (!user) {
            throw new AppError_1.default('User no longer exists', 401);
        }
        const payload = { id: user._id.toString(), role: user.role };
        const accessToken = (0, jwt_1.signToken)(payload, env_1.default.jwtExpiresIn);
        const newRefreshToken = (0, jwt_1.signToken)(payload, env_1.default.jwtRefreshExpiresIn);
        return { accessToken, refreshToken: newRefreshToken };
    }
    async getProfile(userId) {
        return await this.getById(userId);
    }
    async updateProfile(userId, updateData) {
        delete updateData.password;
        delete updateData.role;
        return await this.update(userId, updateData);
    }
    async googleAuth(data) {
        let user = await this.repository.findByEmail(data.email);
        if (!user) {
            user = await this.repository.create({
                name: data.name,
                email: data.email,
                provider: 'google',
                googleId: data.googleId,
                avatar: data.avatar,
            });
        }
        else {
            let needsSave = false;
            if (user.provider !== 'google') {
                user.provider = 'google';
                user.googleId = data.googleId;
                needsSave = true;
            }
            if (data.avatar && !user.avatar) {
                user.avatar = data.avatar;
                needsSave = true;
            }
            if (user.status === 'inactive') {
                user.status = 'active';
                needsSave = true;
            }
            if (needsSave) {
                await user.save();
            }
        }
        const payload = { id: user._id, role: user.role };
        const accessToken = (0, jwt_1.signToken)(payload, env_1.default.jwtExpiresIn);
        const refreshToken = (0, jwt_1.signToken)(payload, env_1.default.jwtRefreshExpiresIn);
        return { user, accessToken, refreshToken };
    }
    async appleAuth(data) {
        let user = await this.repository.findByEmail(data.email);
        if (!user) {
            user = await this.repository.create({
                name: data.name || 'Apple User',
                email: data.email,
                provider: 'apple',
                appleId: data.appleId,
            });
        }
        else {
            let needsSave = false;
            if (user.provider !== 'apple') {
                user.provider = 'apple';
                user.appleId = data.appleId;
                needsSave = true;
            }
            if (user.status === 'inactive') {
                user.status = 'active';
                needsSave = true;
            }
            if (needsSave) {
                await user.save();
            }
        }
        const payload = { id: user._id, role: user.role };
        const accessToken = (0, jwt_1.signToken)(payload, env_1.default.jwtExpiresIn);
        const refreshToken = (0, jwt_1.signToken)(payload, env_1.default.jwtRefreshExpiresIn);
        return { user, accessToken, refreshToken };
    }
    async toggleWishlist(userId, projectId) {
        const user = await this.repository.findById(userId);
        if (!user) {
            throw new AppError_1.default('User not found', 404);
        }
        // Initialize wishlist if undefined
        if (!user.wishlist) {
            user.wishlist = [];
        }
        const projectIdStr = projectId.toString();
        const index = user.wishlist.findIndex((id) => id.toString() === projectIdStr);
        if (index > -1) {
            // Remove from wishlist
            user.wishlist.splice(index, 1);
        }
        else {
            // Add to wishlist
            user.wishlist.push(projectId);
        }
        await user.save();
        return user;
    }
    async getWishlist(userId) {
        const user = await this.repository.findById(userId);
        if (!user) {
            throw new AppError_1.default('User not found', 404);
        }
        // We populate the wishlist items from the Project collection
        const populatedUser = await user.populate({
            path: 'wishlist',
            select: 'title images location emirate price status category urlSlug'
        });
        return populatedUser.wishlist || [];
    }
    async deleteAccount(userId) {
        const user = await this.repository.findById(userId);
        if (!user) {
            throw new AppError_1.default('User not found', 404);
        }
        user.status = 'inactive';
        await user.save();
    }
}
exports.default = new UserService();
