"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadResume = uploadResume;
exports.listResumes = listResumes;
exports.getResumeById = getResumeById;
exports.deleteResume = deleteResume;
const Resume_model_1 = require("../models/Resume.model");
const User_model_1 = require("../models/User.model");
const Analysis_model_1 = require("../models/Analysis.model");
const pdf_service_1 = require("./pdf.service");
const resume_repository_1 = require("../repositories/resume.repository");
const auth_service_1 = require("./auth.service");
const storage_service_1 = require("./storage.service");
async function uploadResume(input) {
    const extractedText = await (0, pdf_service_1.extractTextFromPdf)(input.buffer);
    const uniqueFileName = `${input.userId}-${Date.now()}`;
    const { url, publicId } = await (0, storage_service_1.uploadBufferToCloudinary)(input.buffer, "resume-analyzer/resumes", uniqueFileName);
    const resume = await Resume_model_1.Resume.create({
        user: input.userId,
        originalFileName: input.originalFileName,
        fileUrl: url,
        cloudinaryPublicId: publicId,
        fileSize: input.fileSize,
        mimeType: input.mimeType,
        extractedText,
        status: "uploaded",
    });
    await User_model_1.User.findByIdAndUpdate(input.userId, { $inc: { resumeCount: 1 } });
    return resume;
}
async function listResumes(userId, query) {
    return (0, resume_repository_1.findResumesForUser)(userId, query);
}
async function getResumeById(userId, resumeId) {
    const resume = await Resume_model_1.Resume.findOne({ _id: resumeId, user: userId }).populate("latestAnalysis");
    if (!resume) {
        throw new auth_service_1.AppError("Resume not found", 404);
    }
    return resume;
}
async function deleteResume(userId, resumeId) {
    const resume = await Resume_model_1.Resume.findOne({ _id: resumeId, user: userId });
    if (!resume) {
        throw new auth_service_1.AppError("Resume not found", 404);
    }
    await (0, storage_service_1.deleteFromCloudinary)(resume.cloudinaryPublicId);
    await resume.deleteOne();
    await Analysis_model_1.Analysis.deleteMany({ resume: resume._id });
    await User_model_1.User.findByIdAndUpdate(userId, { $inc: { resumeCount: -1 } });
}
