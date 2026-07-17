"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchema = new mongoose_1.default.Schema({
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
        required: [
            function () {
                return this.provider === 'local' || !this.provider;
            },
            'Please provide a password'
        ],
        minlength: 8,
        select: false,
    },
    avatar: String,
    phone: {
        type: String,
        trim: true,
    },
    wishlist: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Project'
        }],
    provider: {
        type: String,
        enum: ['local', 'google', 'apple'],
        default: 'local',
    },
    googleId: String,
    appleId: String,
    role: {
        type: String,
        enum: ['user'],
        default: 'user',
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
}, { timestamps: true });
userSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password)
        return;
    this.password = await bcryptjs_1.default.hash(this.password, 12);
});
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    if (!userPassword)
        return false;
    return await bcryptjs_1.default.compare(candidatePassword, userPassword);
};
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
