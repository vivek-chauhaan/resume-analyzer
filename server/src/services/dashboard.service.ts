import { Types } from "mongoose";
import { User } from "../models/User.model";
import { Resume } from "../models/Resume.model";
import { Analysis } from "../models/Analysis.model";
import { AppError } from "./auth.service";

interface AggregateRow {
  _id: null;
  analyzedCount: number;
  averageScore: number;
  bestScore: number;
}

export async function getDashboardStats(userId: string) {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const [aggregateRows, latestAnalysis] = await Promise.all([
    Resume.aggregate<AggregateRow>([
      { $match: { user: new Types.ObjectId(userId), latestAnalysis: { $ne: null } } },
      {
        $lookup: {
          from: Analysis.collection.name,
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
    Analysis.findOne({ user: userId }).sort({ createdAt: -1 }),
  ]);

  const summary = aggregateRows[0];

  let latest = null;
  if (latestAnalysis) {
    const resume = await Resume.findById(latestAnalysis.resume).select("originalFileName");
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