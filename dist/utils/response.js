"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = void 0;
const sendSuccess = (res, statusCode, message, data = null) => {
    const response = {
        status: 'success',
        message,
    };
    if (data !== null) {
        response.data = data;
    }
    return res.status(statusCode).json(response);
};
exports.sendSuccess = sendSuccess;
const sendError = (res, statusCode, message) => {
    return res.status(statusCode).json({
        status: 'fail',
        message,
    });
};
exports.sendError = sendError;
