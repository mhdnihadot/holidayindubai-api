"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = __importDefault(require("./env"));
const logger_1 = __importDefault(require("../utils/logger"));
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(env_1.default.mongoUri);
        logger_1.default.info(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        logger_1.default.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};
exports.default = connectDB;
