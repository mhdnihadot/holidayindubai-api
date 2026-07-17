"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const adminSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false,
    },
    role: {
        type: String,
        enum: ['admin'],
        default: 'admin',
    },
}, { timestamps: true });
adminSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password)
        return;
    this.password = await bcryptjs_1.default.hash(this.password, 12);
});
adminSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    if (!userPassword)
        return false;
    return await bcryptjs_1.default.compare(candidatePassword, userPassword);
};
const Admin = mongoose_1.default.model('Admin', adminSchema);
exports.default = Admin;
