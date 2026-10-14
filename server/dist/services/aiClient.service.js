"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callAnalyze = callAnalyze;
exports.callSemanticMatch = callSemanticMatch;
exports.pingAiService = pingAiService;
const axios_1 = __importDefault(require("axios"));
const env_1 = require("../config/env");
const aiHttp = axios_1.default.create({
    baseURL: env_1.env.aiServiceUrl,
    timeout: env_1.env.aiServiceTimeoutMs,
});
/**
 * Calls the Python /analyze endpoint (skill extraction + entities + readability).
 * Returns null on any failure (timeout, connection refused, 5xx) so the caller
 * can fall back to rule-based-only scoring instead of failing the whole request.
 */
async function callAnalyze(text) {
    try {
        const res = await aiHttp.post("/analyze", { text });
        return res.data;
    }
    catch (err) {
        console.warn("[aiClient] /analyze failed, falling back to rule-based only:", err.message);
        return null;
    }
}
/**
 * Calls the Python /semantic-match endpoint. Optional — only used when the
 * user pastes a job description (Day 6 feature). Same fallback behavior.
 */
async function callSemanticMatch(resumeText, jobDescription) {
    try {
        const res = await aiHttp.post("/semantic-match", {
            resumeText,
            jobDescription,
        });
        return res.data;
    }
    catch (err) {
        console.warn("[aiClient] /semantic-match failed:", err.message);
        return null;
    }
}
async function pingAiService() {
    try {
        await aiHttp.get("/health");
        return true;
    }
    catch {
        return false;
    }
}
