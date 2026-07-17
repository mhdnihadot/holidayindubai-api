"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectRedis = exports.redisClient = void 0;
const redis_1 = require("redis");
const env_1 = __importDefault(require("./env"));
const logger_1 = __importDefault(require("../utils/logger"));
const redisClient = (0, redis_1.createClient)({
    url: env_1.default.redisUrl
});
exports.redisClient = redisClient;
redisClient.on('error', (err) => logger_1.default.error(`Redis Client Error: ${err.message}`));
redisClient.on('connect', () => logger_1.default.info('Redis Connected'));
const connectRedis = async () => {
    try {
        await redisClient.connect();
    }
    catch (err) {
        logger_1.default.error(`Could not connect to Redis: ${err.message}`);
    }
};
exports.connectRedis = connectRedis;
