// import { Analysis, IAnalysis } from "../models/Analysis.model";
// import { Resume } from "../models/Resume.model";
// import { runRuleBasedScoring } from "./ats.service";
// import { AppError } from "./auth.service";

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

import { Analysis, IAnalysis } from "../models/Analysis.model";
import { Resume } from "../models/Resume.model";
import { runRuleBasedScoring } from "./ats.service";
import { callAnalyze } from "./aiClient.service";
import { AppError } from "./auth.service";

export async function runAnalysis(
  userId: string,
  resumeId: string,
): Promise<IAnalysis> {
  const resume = await Resume.findOne({ _id: resumeId, user: userId });
  if (!resume) {
    throw new AppError("Resume not found", 404);
  }
  if (!resume.extractedText) {
    throw new AppError("This resume has no extracted text to analyze", 422);
  }

  resume.status = "analyzing";
  await resume.save();

  try {
    const ruleResult = runRuleBasedScoring(resume.extractedText); // out of 85
    const aiResult = await callAnalyze(resume.extractedText); // null if AI service is down/slow

    // AI layer contributes up to 15 points. We don't have a job description yet
    // (that's Day 6), so this scales the AI-side readability score into the
    // remaining weight rather than leaving it unused.
    const aiScore = aiResult
      ? Math.round((aiResult.readabilityScore / 100) * 15)
      : 0;
    const overallScore = Math.min(100, ruleResult.overallScore + aiScore);

    const analysis = await Analysis.create({
      resume: resume._id,
      user: userId,
      overallScore,
      sectionScores: ruleResult.sectionScores,
      keywordAnalysis: ruleResult.keywordAnalysis,
      formattingScore: ruleResult.formattingScore,
      readabilityScore: ruleResult.readabilityScore,
      aiInsights: {
        extractedSkills: aiResult?.extractedSkills ?? [],
        semanticJobMatch: null, // populated Day 6, once a job description is provided
        entities: aiResult?.entities ?? { organizations: [], noun_phrases: [] },
        modelVersion: aiResult ? "all-MiniLM-L6-v2" : "unavailable",
      },
      strengths: ruleResult.strengths,
      weaknesses: ruleResult.weaknesses,
      suggestions: ruleResult.suggestions,
      summary: ruleResult.summary,
    });

    resume.status = "analyzed";
    resume.latestAnalysis = analysis._id;
    await resume.save();

    return analysis;
  } catch (err) {
    resume.status = "failed";
    await resume.save();
    throw err;
  }
}

export async function getAnalysis(
  userId: string,
  resumeId: string,
  all: boolean,
): Promise<IAnalysis | IAnalysis[]> {
  const resume = await Resume.findOne({ _id: resumeId, user: userId });
  if (!resume) {
    throw new AppError("Resume not found", 404);
  }

  if (all) {
    return Analysis.find({ resume: resumeId, user: userId }).sort({
      createdAt: -1,
    });
  }

  if (!resume.latestAnalysis) {
    throw new AppError("This resume has not been analyzed yet", 404);
  }

  const analysis = await Analysis.findById(resume.latestAnalysis);
  if (!analysis) {
    throw new AppError("Analysis not found", 404);
  }
  return analysis;
}
