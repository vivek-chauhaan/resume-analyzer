import { Response } from "express";
import { Request } from "express";
import { catchAsync } from "../utils/catchAsync";
import { extractTextFromPdf } from "../services/pdf.service";
import { runRuleBasedScoring } from "../services/ats.service";
import { callAnalyze } from "../services/aiClient.service";
import { AppError } from "../services/auth.service";

// No Cloudinary upload, no Mongo write — the file only ever exists in memory
// for the duration of this one request.
export const analyzeGuestResume = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.file) {
      throw new AppError(
        "No file uploaded. Attach a PDF under the 'resume' field.",
        400,
      );
    }

    const extractedText = await extractTextFromPdf(req.file.buffer);
    if (!extractedText) {
      throw new AppError("Couldn't read text from this PDF", 422);
    }

    const ruleResult = runRuleBasedScoring(extractedText);
    const aiResult = await callAnalyze(extractedText);
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
  },
);
