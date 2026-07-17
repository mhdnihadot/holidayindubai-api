"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const AppError_1 = __importDefault(require("../core/errors/AppError"));
const validate = (schema) => {
    return (req, res, next) => {
        const validSchema = joi_1.default.compile(schema);
        const object = Object.keys(schema).reduce((acc, key) => {
            if (Object.prototype.hasOwnProperty.call(req, key)) {
                acc[key] = req[key];
            }
            return acc;
        }, {});
        const { value, error } = validSchema.validate(object, {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true,
        });
        if (error) {
            const errorMessage = error.details.map((details) => details.message).join(', ');
            return next(new AppError_1.default(errorMessage, 400));
        }
        Object.assign(req, value);
        return next();
    };
};
exports.default = validate;
