"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardStats = getDashboardStats;
const mongoose_1 = require("mongoose");
const User_model_1 = require("../models/User.model");
const Resume_model_1 = require("../models/Resume.model");
const Analysis_model_1 = require("../models/Analysis.model");
const auth_service_1 = require("./auth.service");
async function getDashboardStats(userId) {
    const user = await User_model_1.User.findById(userId);
    if (!user) {
        throw new auth_service_1.AppError("User not found", 404);
    }
    const [aggregateRows, latestAnalysis] = await Promise.all([
        Resume_model_1.Resume.aggregate([
            { $match: { user: new mongoose_1.Types.ObjectId(userId), latestAnalysis: { $ne: null } } },
            {
                $lookup: {
                    from: Analysis_model_1.Analysis.collection.name,
                    localField: "latestAnalysis",
                    foreignField: "_id",
                    as: "analysis",
                },
            },
            { $unwind: "$analysis" },
            {
                $group: {
                    _id: null,
                    analyzedCount: { $sum: 1 },
                    averageScore: { $avg: "$analysis.overallScore" },
                    bestScore: { $max: "$analysis.overallScore" },
                },
            },
        ]),
        Analysis_model_1.Analysis.findOne({ user: userId }).sort({ createdAt: -1 }),
    ]);
    const summary = aggregateRows[0];
    let latest = null;
    if (latestAnalysis) {
        const resume = await Resume_model_1.Resume.findById(latestAnalysis.resume).select("originalFileName");
        if (resume) {
            latest = {
                resumeId: resume._id.toString(),
                fileName: resume.originalFileName,
                overallScore: latestAnalysis.overallScore,
                summary: latestAnalysis.summary,
                suggestions: latestAnalysis.suggestions.slice(0, 3), // preview only
                createdAt: latestAnalysis.createdAt,
            };
        }
    }
    return {
        totalResumes: user.resumeCount,
        analyzedCount: summary?.analyzedCount ?? 0,
        averageScore: summary ? Math.round(summary.averageScore) : null,
        bestScore: summary ? summary.bestScore : null,
        lastAnalysisAt: user.lastAnalysisAt ?? null,
        latest,
    };
}
