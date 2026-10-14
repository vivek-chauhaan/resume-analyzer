"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const multer_1 = require("../config/multer");
const publicAnalysis_controller_1 = require("../controllers/publicAnalysis.controller");
const router = (0, express_1.Router)();
const guestLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 free tries per IP per hour
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        data: null,
        message: "You've hit the free-trial limit. Sign up for unlimited analyses.",
    },
});
router.post("/analyze", guestLimiter, multer_1.resumeUpload.single("resume"), publicAnalysis_controller_1.analyzeGuestResume);
exports.default = router;
