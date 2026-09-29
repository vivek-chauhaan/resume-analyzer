import axios from "axios";
import { env } from "../config/env";

interface AiAnalyzeResult {
  extractedSkills: string[];
  entities: { organizations: string[]; noun_phrases: string[] };
  readabilityScore: number;
}

interface AiSemanticMatchResult {
  semanticJobMatch: number;
}

const aiHttp = axios.create({
  baseURL: env.aiServiceUrl,
  timeout: env.aiServiceTimeoutMs,
});

/**
 * Calls the Python /analyze endpoint (skill extraction + entities + readability).
 * Returns null on any failure (timeout, connection refused, 5xx) so the caller
 * can fall back to rule-based-only scoring instead of failing the whole request.
 */
export async function callAnalyze(
  text: string,
): Promise<AiAnalyzeResult | null> {
  try {
    const res = await aiHttp.post<AiAnalyzeResult>("/analyze", { text });
    return res.data;
  } catch (err) {
    console.warn(
      "[aiClient] /analyze failed, falling back to rule-based only:",
      (err as Error).message,
    );
    return null;
  }
}

/**
 * Calls the Python /semantic-match endpoint. Optional — only used when the
 * user pastes a job description (Day 6 feature). Same fallback behavior.
 */
export async function callSemanticMatch(
  resumeText: string,
  jobDescription: string,
): Promise<AiSemanticMatchResult | null> {
  try {
    const res = await aiHttp.post<AiSemanticMatchResult>("/semantic-match", {
      resumeText,
      jobDescription,
    });
    return res.data;
  } catch (err) {
    console.warn("[aiClient] /semantic-match failed:", (err as Error).message);
    return null;
  }
}

export async function pingAiService(): Promise<boolean> {
  try {
    await aiHttp.get("/health");
    return true;
  } catch {
    return false;
  }
}
