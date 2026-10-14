"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resume = void 0;
const mongoose_1 = require("mongoose");
const resumeSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    originalFileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    cloudinaryPublicId: { type: String, required: true },
    fileSize: { type: Number, required: true },
    mimeType: { type: String, required: true },
    extractedText: { type: String, default: "" },
    status: {
        type: String,
        enum: ["uploaded", "analyzing", "analyzed", "failed"],
        default: "uploaded",
    },
    latestAnalysis: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Analysis",
        default: null,
    },
}, { timestamps: true });
resumeSchema.index({ user: 1, createdAt: -1 });
resumeSchema.index({ extractedText: "text" });
exports.Resume = (0, mongoose_1.model)("Resume", resumeSchema);
