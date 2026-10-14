"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeGuestResume = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const pdf_service_1 = require("../services/pdf.service");
const ats_service_1 = require("../services/ats.service");
const aiClient_service_1 = require("../services/aiClient.service");
const auth_service_1 = require("../services/auth.service");
// No Cloudinary upload, no Mongo write — the file only ever exists in memory
// for the duration of this one request.
exports.analyzeGuestResume = (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.file) {
        throw new auth_service_1.AppError("No file uploaded. Attach a PDF under the 'resume' field.", 400);
    }
    const extractedText = await (0, pdf_service_1.extractTextFromPdf)(req.file.buffer);
    if (!extractedText) {
        throw new auth_service_1.AppError("Couldn't read text from this PDF", 422);
    }
    const ruleResult = (0, ats_service_1.runRuleBasedScoring)(extractedText);
    const aiResult = await (0, aiClient_service_1.callAnalyze)(extractedText);
    const aiScore = aiResult
        ? Math.round((aiResult.readabilityScore / 100) * 15)
        : 0;
    const overallScore = Math.min(100, ruleResult.overallScore + aiScore);
    res.status(200).json({
        success: true,
        data: {
            overallScore,
            sectionScores: ruleResult.sectionScores,
            keywordAnalysis: ruleResult.keywordAnalysis,
            formattingScore: ruleResult.formattingScore,
            readabilityScore: ruleResult.readabilityScore,
            strengths: ruleResult.strengths,
            weaknesses: ruleResult.weaknesses,
            suggestions: ruleResult.suggestions,
            summary: ruleResult.summary,
            aiInsights: {
                extractedSkills: aiResult?.extractedSkills ?? [],
                modelVersion: aiResult ? "all-MiniLM-L6-v2" : "unavailable",
            },
        },
        message: "Analysis complete (not saved — sign up to keep your history)",
    });
});
