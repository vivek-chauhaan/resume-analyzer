import fs from "fs/promises";
import { Resume, IResume } from "../models/Resume.model";
import { User } from "../models/User.model";
import { extractTextFromPdf } from "./pdf.service";
import { findResumesForUser, ResumeListQuery } from "../repositories/resume.repository";
import { AppError } from "./auth.service";

interface UploadResumeInput {
  userId: string;
  originalFileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
}

export async function uploadResume(input: UploadResumeInput): Promise<IResume> {
  const extractedText = await extractTextFromPdf(input.filePath);

  const resume = await Resume.create({
    user: input.userId,
    originalFileName: input.originalFileName,
    filePath: input.filePath,
    fileSize: input.fileSize,
    mimeType: input.mimeType,
    extractedText,
    status: "uploaded",
  });

  // Denormalized counter on User, per the schema design
  await User.findByIdAndUpdate(input.userId, { $inc: { resumeCount: 1 } });

  return resume;
}

export async function listResumes(userId: string, query: ResumeListQuery) {
  return findResumesForUser(userId, query);
}

export async function getResumeById(userId: string, resumeId: string): Promise<IResume> {
  const resume = await Resume.findOne({ _id: resumeId, user: userId }).populate("latestAnalysis");
  if (!resume) {
    throw new AppError("Resume not found", 404);
  }
  return resume;
}

export async function deleteResume(userId: string, resumeId: string): Promise<void> {
  const resume = await Resume.findOne({ _id: resumeId, user: userId });
  if (!resume) {
    throw new AppError("Resume not found", 404);
  }

  // Best-effort file cleanup — a missing file on disk shouldn't block deleting the record
  try {
    await fs.unlink(resume.filePath);
  } catch {
    // file already gone or inaccessible — ignore
  }

  await resume.deleteOne();
  await User.findByIdAndUpdate(userId, { $inc: { resumeCount: -1 } });
  // Note: associated Analysis docs are cleaned up starting Day 4, once that model exists.
}
