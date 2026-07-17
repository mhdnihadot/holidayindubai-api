"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProject = exports.createProject = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createProject = {
    body: joi_1.default.object().keys({
        title: joi_1.default.string().required(),
        subtitle: joi_1.default.string().allow('', null),
        description: joi_1.default.string().required(),
        location: joi_1.default.string().allow('', null),
        googleMapUrl: joi_1.default.string().allow('', null),
        emirate: joi_1.default.string().valid('Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah').allow('', null),
        category: joi_1.default.string().allow('', null),
        duration: joi_1.default.string().allow('', null),
        bestTime: joi_1.default.string().allow('', null),
        bestSeason: joi_1.default.string().allow('', null),
        outdoor: joi_1.default.boolean().allow(null),
        highlights: joi_1.default.array().items(joi_1.default.object({
            icon: joi_1.default.string().allow('', null),
            text: joi_1.default.string().allow('', null)
        })).allow(null),
        idealFor: joi_1.default.array().items(joi_1.default.object({
            icon: joi_1.default.string().allow('', null),
            text: joi_1.default.string().allow('', null)
        })).allow(null),
        distanceFromCity: joi_1.default.string().allow('', null),
        nearbyLandmarks: joi_1.default.array().items(joi_1.default.string()).allow(null),
        dressCode: joi_1.default.object({
            recommended: joi_1.default.string().allow('', null),
            avoid: joi_1.default.string().allow('', null)
        }).allow(null),
        safetyAndComfort: joi_1.default.array().items(joi_1.default.object({
            icon: joi_1.default.string().allow('', null),
            title: joi_1.default.string().allow('', null),
            description: joi_1.default.string().allow('', null)
        })).allow(null),
        accessibility: joi_1.default.array().items(joi_1.default.object({
            icon: joi_1.default.string().allow('', null),
            title: joi_1.default.string().allow('', null),
            description: joi_1.default.string().allow('', null)
        })).allow(null),
        experienceSteps: joi_1.default.array().items(joi_1.default.object({
            title: joi_1.default.string().allow('', null),
            content: joi_1.default.string().allow('', null)
        })).allow(null),
        platformUrl: joi_1.default.string().uri().allow('', null),
        status: joi_1.default.string().valid('active', 'inactive', 'completed'),
        images: joi_1.default.array().items(joi_1.default.string()),
    }),
};
exports.updateProject = {
    body: joi_1.default.object().keys({
        title: joi_1.default.string(),
        subtitle: joi_1.default.string().allow('', null),
        description: joi_1.default.string(),
        location: joi_1.default.string().allow('', null),
        googleMapUrl: joi_1.default.string().allow('', null),
        emirate: joi_1.default.string().valid('Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah').allow('', null),
        category: joi_1.default.string().allow('', null),
        duration: joi_1.default.string().allow('', null),
        bestTime: joi_1.default.string().allow('', null),
        bestSeason: joi_1.default.string().allow('', null),
        outdoor: joi_1.default.boolean().allow(null),
        highlights: joi_1.default.array().items(joi_1.default.object({
            icon: joi_1.default.string().allow('', null),
            text: joi_1.default.string().allow('', null)
        })).allow(null),
        idealFor: joi_1.default.array().items(joi_1.default.object({
            icon: joi_1.default.string().allow('', null),
            text: joi_1.default.string().allow('', null)
        })).allow(null),
        distanceFromCity: joi_1.default.string().allow('', null),
        nearbyLandmarks: joi_1.default.array().items(joi_1.default.string()).allow(null),
        dressCode: joi_1.default.object({
            recommended: joi_1.default.string().allow('', null),
            avoid: joi_1.default.string().allow('', null)
        }).allow(null),
        safetyAndComfort: joi_1.default.array().items(joi_1.default.object({
            icon: joi_1.default.string().allow('', null),
            title: joi_1.default.string().allow('', null),
            description: joi_1.default.string().allow('', null)
        })).allow(null),
        accessibility: joi_1.default.array().items(joi_1.default.object({
            icon: joi_1.default.string().allow('', null),
            title: joi_1.default.string().allow('', null),
            description: joi_1.default.string().allow('', null)
        })).allow(null),
        experienceSteps: joi_1.default.array().items(joi_1.default.object({
            title: joi_1.default.string().allow('', null),
            content: joi_1.default.string().allow('', null)
        })).allow(null),
        platformUrl: joi_1.default.string().uri().allow('', null),
        status: joi_1.default.string().valid('active', 'inactive', 'completed'),
        images: joi_1.default.array().items(joi_1.default.string()),
    }).min(1),
};
