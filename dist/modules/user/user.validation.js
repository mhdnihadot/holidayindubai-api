"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfile = exports.login = exports.register = void 0;
const joi_1 = __importDefault(require("joi"));
exports.register = {
    body: joi_1.default.object().keys({
        name: joi_1.default.string().required(),
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(8).required(),
    }),
};
exports.login = {
    body: joi_1.default.object().keys({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().required(),
    }),
};
exports.updateProfile = {
    body: joi_1.default.object().keys({
        name: joi_1.default.string(),
        email: joi_1.default.string().email(),
        phone: joi_1.default.string().allow('', null).optional(),
        avatar: joi_1.default.string().uri().allow('', null).optional(),
    }).min(1),
};
