"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = __importDefault(require("./config/env"));
const db_1 = __importDefault(require("./config/db"));
const redis_1 = require("./config/redis");
const logger_1 = __importDefault(require("./utils/logger"));
process.on('uncaughtException', (err) => {
    logger_1.default.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    logger_1.default.error(`${err.name}: ${err.message}`);
    process.exit(1);
});
// Initialize Server
const startServer = async () => {
    // Connect to databases
    await (0, db_1.default)();
    await (0, redis_1.connectRedis)();
    const server = app_1.default.listen(env_1.default.port, () => {
        logger_1.default.info(`App running on port ${env_1.default.port}...`);
    });
    process.on('unhandledRejection', (err) => {
        logger_1.default.error('UNHANDLED REJECTION! 💥 Shutting down...');
        logger_1.default.error(`${err.name}: ${err.message}`);
        server.close(() => {
            process.exit(1);
        });
    });
};
startServer();
