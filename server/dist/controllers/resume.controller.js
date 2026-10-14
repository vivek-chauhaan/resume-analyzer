"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteResume = exports.getResumeById = exports.listResumes = exports.uploadResume = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const resumeService = __importStar(require("../services/resume.service"));
const auth_service_1 = require("../services/auth.service");
exports.uploadResume = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.file) {
        throw new auth_service_1.AppError("No file uploaded. Attach a PDF under the 'resume' field.", 400);
    }
    const resume = await resumeService.uploadResume({
        userId: req.userId,
        originalFileName: req.file.originalname,
        buffer: req.file.buffer,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
    });
    res
        .status(201)
        .json({
        success: true,
        data: resume,
        message: "Resume uploaded successfully",
    });
});
exports.listResumes = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 10, sortBy = "createdAt", order = "desc", status, search, } = req.query;
    const result = await resumeService.listResumes(req.userId, {
        page: Number(page),
        limit: Number(limit),
        sortBy: sortBy,
        order: order,
        status: status,
        search: search,
    });
    res
        .status(200)
        .json({ success: true, data: result, message: "Resumes fetched" });
});
exports.getResumeById = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const resume = await resumeService.getResumeById(req.userId, req.params.id);
    res
        .status(200)
        .json({ success: true, data: resume, message: "Resume fetched" });
});
exports.deleteResume = (0, catchAsync_1.catchAsync)(async (req, res) => {
    await resumeService.deleteResume(req.userId, req.params.id);
    res
        .status(200)
        .json({ success: true, data: null, message: "Resume deleted" });
});
