"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.getUserProfile = getUserProfile;
const User_model_1 = require("../models/User.model");
const token_service_1 = require("./token.service");
class AppError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.AppError = AppError;
function toPublicUser(user) {
    return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar ?? null,
        resumeCount: user.resumeCount,
        lastAnalysisAt: user.lastAnalysisAt ?? null,
    };
}
async function registerUser(input) {
    const existing = await User_model_1.User.findOne({ email: input.email.toLowerCase() });
    if (existing) {
        throw new AppError("An account with this email already exists", 409);
    }
    const user = await User_model_1.User.create({
        name: input.name,
        email: input.email.toLowerCase(),
        password: input.password,
    });
    const token = (0, token_service_1.signToken)({ userId: user._id.toString() });
    return { user: toPublicUser(user), token };
}
async function loginUser(input) {
    const user = await User_model_1.User.findOne({ email: input.email.toLowerCase() }).select("+password");
    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }
    const isMatch = await user.comparePassword(input.password);
    if (!isMatch) {
        throw new AppError("Invalid email or password", 401);
    }
    const token = (0, token_service_1.signToken)({ userId: user._id.toString() });
    return { user: toPublicUser(user), token };
}
async function getUserProfile(userId) {
    const user = await User_model_1.User.findById(userId);
    if (!user) {
        throw new AppError("User not found", 404);
    }
    return toPublicUser(user);
}
