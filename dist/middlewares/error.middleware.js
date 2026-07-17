"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../utils/logger"));
const env_1 = __importDefault(require("../config/env"));
const AppError_1 = __importDefault(require("../core/errors/AppError"));
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError_1.default(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
    const value = err.errmsg ? err.errmsg.match(/(["'])(\\?.)*?\1/)[0] : '';
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError_1.default(message, 400);
};
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError_1.default(message, 400);
};
const handleJWTError = () => new AppError_1.default('Invalid token. Please log in again!', 401);
const handleJWTExpiredError = () => new AppError_1.default('Your token has expired! Please log in again.', 401);
const sendErrorDev = (err, res) => {
    console.error('ERROR 💥', err);
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};
const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }
    else {
        logger_1.default.error('ERROR 💥', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        });
    }
};
exports.default = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (env_1.default.nodeEnv === 'development') {
        sendErrorDev(err, res);
    }
    else {
        let error = { ...err };
        error.message = err.message;
        error.name = err.name;
        error.errmsg = err.errmsg;
        if (error.name === 'CastError')
            error = handleCastErrorDB(error);
        if (error.code === 11000)
            error = handleDuplicateFieldsDB(error);
        if (error.name === 'ValidationError')
            error = handleValidationErrorDB(error);
        if (error.name === 'JsonWebTokenError')
            error = handleJWTError();
        if (error.name === 'TokenExpiredError')
            error = handleJWTExpiredError();
        sendErrorProd(error, res);
    }
};
