"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const rateLimiter_middleware_1 = require("./middlewares/rateLimiter.middleware");
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
const AppError_1 = __importDefault(require("./core/errors/AppError"));
const env_1 = __importDefault(require("./config/env"));
// Routes
const user_routes_1 = __importDefault(require("./modules/user/user.routes"));
const admin_routes_1 = __importDefault(require("./modules/admin/admin.routes"));
const project_routes_1 = __importDefault(require("./modules/project/project.routes"));
const app = (0, express_1.default)();
// Security HTTP headers
app.use((0, helmet_1.default)());
// Request logging
app.use((0, morgan_1.default)(env_1.default.nodeEnv === 'development' ? 'dev' : 'combined'));
// CORS configuration
const corsOptions = {
    origin: env_1.default.nodeEnv === 'production'
        ? [...(env_1.default.corsOrigin ? env_1.default.corsOrigin.split(',').map(o => o.trim()) : []), 'https://www.holidayindubai.com', 'https://holidayindubai.com']
        : true, // Use `true` to reflect origin, as '*' is not allowed with credentials: true
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
// Body parser
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
app.use((0, cookie_parser_1.default)());
// Limit requests from same API (Production Only)
if (env_1.default.nodeEnv === 'production') {
    app.use('/api', rateLimiter_middleware_1.apiLimiter);
    app.use('/api/v1/user/login', rateLimiter_middleware_1.authLimiter);
    app.use('/api/v1/user/register', rateLimiter_middleware_1.authLimiter);
    app.use('/api/v1/admin/login', rateLimiter_middleware_1.authLimiter);
}
// Routes
app.use('/api/v1/user', user_routes_1.default);
app.use('/api/v1/admin', admin_routes_1.default);
app.use('/api/v1/project', project_routes_1.default);
// Handle undefined Routes
app.use((req, res, next) => {
    next(new AppError_1.default(`Can't find ${req.originalUrl} on this server!`, 404));
});
// Global Error Handler
app.use(error_middleware_1.default);
exports.default = app;
