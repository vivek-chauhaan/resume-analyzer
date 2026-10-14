"use strict";
// import { Analysis, IAnalysis } from "../models/Analysis.model";
// import { Resume } from "../models/Resume.model";
// import { runRuleBasedScoring } from "./ats.service";
// import { AppError } from "./auth.service";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runAnalysis = runAnalysis;
exports.runJobMatch = runJobMatch;
exports.getAnalysis = getAnalysis;
// export async function runAnalysis(userId: string, resumeId: string): Promise<IAnalysis> {
//   const resume = await Resume.findOne({ _id: resumeId, user: userId });
//   if (!resume) {
//     throw new AppError("Resume not found", 404);
//   }
//   if (!resume.extractedText) {
//     throw new AppError("This resume has no extracted text to analyze", 422);
//   }
//   resume.status = "analyzing";
//   await resume.save();
//   try {
//     const result = runRuleBasedScoring(resume.extractedText);
//     // Day 5 rescales this to /100 once the AI layer's 15-point contribution exists.
//     // For now, rescale the 85-point rule-based total to a 100-point overallScore
//     // so the frontend doesn't need to know which day added what.
//     const overallScore = Math.round((result.overallScore / 85) * 100);
//     const analysis = await Analysis.create({
//       resume: resume._id,
//       user: userId,
//       overallScore,
//       sectionScores: result.sectionScores,
//       keywordAnalysis: result.keywordAnalysis,
//       formattingScore: result.formattingScore,
//       readabilityScore: result.readabilityScore,
//       strengths: result.strengths,
//       weaknesses: result.weaknesses,
//       suggestions: result.suggestions,
//       summary: result.summary,
//     });
//     resume.status = "analyzed";
//     resume.latestAnalysis = analysis._id;
//     await resume.save();
//     return analysis;
//   } catch (err) {
//     resume.status = "failed";
//     await resume.save();
//     throw err;
//   }
// }
const Analysis_model_1 = require("../models/Analysis.model");
const Resume_model_1 = require("../models/Resume.model");
const User_model_1 = require("../models/User.model");
const ats_service_1 = require("./ats.service");
const aiClient_service_1 = require("./aiClient.service");
const auth_service_1 = require("./auth.service");
/**
 * Run complete resume analysis
 */
async function runAnalysis(userId, resumeId) {
    const resume = await Resume_model_1.Resume.findOne({
        _id: resumeId,
        user: userId,
    });
    if (!resume) {
        throw new auth_service_1.AppError("Resume not found", 404);
    }
    if (!resume.extractedText) {
        throw new auth_service_1.AppError("This resume has no extracted text to analyze", 422);
    }
    resume.status = "analyzing";
    await resume.save();
    try {
        // Rule-based scoring: out of 85
        const ruleResult = (0, ats_service_1.runRuleBasedScoring)(resume.extractedText);
        // AI analysis
        const aiResult = await (0, aiClient_service_1.callAnalyze)(resume.extractedText);
        // AI contributes up to 15 points
        const aiScore = aiResult
            ? Math.round((aiResult.readabilityScore / 100) * 15)
            : 0;
        const overallScore = Math.min(100, ruleResult.overallScore + aiScore);
        // Create analysis document
        const analysis = await Analysis_model_1.Analysis.create({
            resume: resume._id,
            user: userId,
            overallScore,
            sectionScores: ruleResult.sectionScores,
            keywordAnalysis: ruleResult.keywordAnalysis,
            formattingScore: ruleResult.formattingScore,
            readabilityScore: ruleResult.readabilityScore,
            aiInsights: {
                extractedSkills: aiResult?.extractedSkills ?? [],
                semanticJobMatch: null,
                entities: aiResult?.entities ?? {
                    organizations: [],
                    noun_phrases: [],
                },
                modelVersion: aiResult ? "all-MiniLM-L6-v2" : "unavailable",
            },
            strengths: ruleResult.strengths,
            weaknesses: ruleResult.weaknesses,
            suggestions: ruleResult.suggestions,
            summary: ruleResult.summary,
        });
        // Update resume after successful analysis
        resume.status = "analyzed";
        resume.latestAnalysis = analysis._id;
        await resume.save();
        // Update user's last analysis timestamp
        await User_model_1.User.findByIdAndUpdate(userId, {
            lastAnalysisAt: new Date(),
        });
        return analysis;
    }
    catch (err) {
        resume.status = "failed";
        await resume.save();
        throw err;
    }
}
/**
 * Match a resume against a job description
 */
async function runJobMatch(userId, resumeId, jobDescription) {
    const resume = await Resume_model_1.Resume.findOne({
        _id: resumeId,
        user: userId,
    });
    if (!resume) {
        throw new auth_service_1.AppError("Resume not found", 404);
    }
    if (!resume.latestAnalysis) {
        throw new auth_service_1.AppError("Run a full analysis before checking a job match", 400);
    }
    const result = await (0, aiClient_service_1.callSemanticMatch)(resume.extractedText, jobDescription);
    if (!result) {
        throw new auth_service_1.AppError("The AI service is currently unavailable — try again shortly", 503);
    }
    const analysis = await Analysis_model_1.Analysis.findByIdAndUpdate(resume.latestAnalysis, {
        "aiInsights.semanticJobMatch": result.semanticJobMatch,
    }, {
        new: true,
    });
    if (!analysis) {
        throw new auth_service_1.AppError("Analysis not found", 404);
    }
    return analysis;
}
/**
 * Get resume analysis
 */
async function getAnalysis(userId, resumeId, all) {
    const resume = await Resume_model_1.Resume.findOne({
        _id: resumeId,
        user: userId,
    });
    if (!resume) {
        throw new auth_service_1.AppError("Resume not found", 404);
    }
    if (all) {
        const analyses = await Analysis_model_1.Analysis.find({
            resume: resumeId,
            user: userId,
        }).sort({ createdAt: -1 });
        return analyses;
    }
    if (!resume.latestAnalysis) {
        throw new auth_service_1.AppError("No analysis found for this resume. Run an analysis first.", 404);
    }
    const analysis = await Analysis_model_1.Analysis.findOne({
        _id: resume.latestAnalysis,
        resume: resumeId,
        user: userId,
    });
    if (!analysis) {
        throw new auth_service_1.AppError("Analysis not found", 404);
    }
    return analysis;
}
