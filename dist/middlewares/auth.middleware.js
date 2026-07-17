"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = exports.protect = void 0;
const jwt_1 = require("../utils/jwt");
const AppError_1 = __importDefault(require("../core/errors/AppError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const redis_1 = require("../config/redis");
exports.protect = (0, catchAsync_1.default)(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError_1.default('You are not logged in! Please log in to get access.', 401));
    }
    // Check if token is blacklisted in Redis
    const isBlacklisted = await redis_1.redisClient.get(`bl_${token}`);
    if (isBlacklisted) {
        return next(new AppError_1.default('Token is no longer valid. Please log in again.', 401));
    }
    // Verify token
    try {
        const decoded = (0, jwt_1.verifyToken)(token);
        req.user = decoded;
        req.token = token;
        next();
    }
    catch (err) {
        return next(new AppError_1.default('Invalid token. Please log in again.', 401));
    }
});
const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new AppError_1.default('You do not have permission to perform this action', 403));
        }
        next();
    };
};
exports.restrictTo = restrictTo;
