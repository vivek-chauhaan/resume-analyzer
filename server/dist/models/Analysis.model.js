"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Analysis = void 0;
const mongoose_1 = require("mongoose");
const analysisSchema = new mongoose_1.Schema({
    resume: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Resume",
        required: true,
        index: true,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    overallScore: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    sectionScores: {
        contact: { type: Number, default: 0 },
        skills: { type: Number, default: 0 },
        education: { type: Number, default: 0 },
        experience: { type: Number, default: 0 },
        projects: { type: Number, default: 0 },
        certifications: { type: Number, default: 0 },
    },
    keywordAnalysis: {
        matchedKeywords: { type: [String], default: [] },
        missingKeywords: { type: [String], default: [] },
        matchPercentage: { type: Number, default: 0 },
    },
    formattingScore: {
        type: Number,
        default: 0,
    },
    readabilityScore: {
        type: Number,
        default: 0,
    },
    aiInsights: {
        extractedSkills: {
            type: [String],
            default: [],
        },
        semanticJobMatch: {
            type: Number,
            default: null,
        },
        entities: {
            organizations: {
                type: [String],
                default: [],
            },
            noun_phrases: {
                type: [String],
                default: [],
            },
        },
        modelVersion: {
            type: String,
            default: "unavailable",
        },
    },
    strengths: {
        type: [String],
        default: [],
    },
    weaknesses: {
        type: [String],
        default: [],
    },
    suggestions: {
        type: [String],
        default: [],
    },
    summary: {
        type: String,
        default: "",
    },
}, { timestamps: true });
analysisSchema.index({ user: 1, createdAt: -1 });
exports.Analysis = (0, mongoose_1.model)("Analysis", analysisSchema);
