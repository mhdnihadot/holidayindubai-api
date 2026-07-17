"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseRepository_1 = __importDefault(require("../../core/BaseRepository"));
const user_model_1 = __importDefault(require("./user.model"));
class UserRepository extends BaseRepository_1.default {
    constructor() {
        super(user_model_1.default);
    }
    async findByEmail(email, selectPassword = false) {
        let query = this.model.findOne({ email });
        if (selectPassword) {
            query = query.select('+password');
        }
        return await query;
    }
}
exports.default = new UserRepository();
