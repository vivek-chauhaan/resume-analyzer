"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.login = exports.register = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const auth_service_1 = require("../services/auth.service");
exports.register = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { name, email, password } = req.body;
    const result = await (0, auth_service_1.registerUser)({ name, email, password });
    res.status(201).json({ success: true, data: result, message: "Account created successfully" });
});
exports.login = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { email, password } = req.body;
    const result = await (0, auth_service_1.loginUser)({ email, password });
    res.status(200).json({ success: true, data: result, message: "Logged in successfully" });
});
exports.getProfile = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const profile = await (0, auth_service_1.getUserProfile)(req.userId);
    res.status(200).json({ success: true, data: profile, message: "Profile fetched" });
});
