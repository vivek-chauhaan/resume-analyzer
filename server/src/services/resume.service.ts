import { Resume, IResume } from "../models/Resume.model";
import { User } from "../models/User.model";
import { Analysis } from "../models/Analysis.model";
import { extractTextFromPdf } from "./pdf.service";

import {
  findResumesForUser,
  ResumeListQuery,
} from "../repositories/resume.repository";
import { AppError } from "./auth.service";
import {
  deleteFromCloudinary,
  uploadBufferToCloudinary,
} from "./storage.service";

interface UploadResumeInput {
  userId: string;
  originalFileName: string;
  buffer: Buffer;
  fileSize: number;
  mimeType: string;
}

export async function uploadResume(input: UploadResumeInput): Promise<IResume> {
  const extractedText = await extractTextFromPdf(input.buffer);

  const uniqueFileName = `${input.userId}-${Date.now()}`;
  const { url, publicId } = await uploadBufferToCloudinary(
    input.buffer,
    "resume-analyzer/resumes",
    uniqueFileName,
  );

  const resume = await Resume.create({
    user: input.userId,
    originalFileName: input.originalFileName,
    fileUrl: url,
    cloudinaryPublicId: publicId,
    fileSize: input.fileSize,
    mimeType: input.mimeType,
    extractedText,
    status: "uploaded",
  });

  await User.findByIdAndUpdate(input.userId, { $inc: { resumeCount: 1 } });
  return resume;
}

export async function listResumes(userId: string, query: ResumeListQuery) {
  return findResumesForUser(userId, query);
}

export async function getResumeById(
  userId: string,
  resumeId: string,
): Promise<IResume> {
  const resume = await Resume.findOne({ _id: resumeId, user: userId }).populate(
    "latestAnalysis",
  );
  if (!resume) {
    throw new AppError("Resume not found", 404);
  }
  return resume;
}

export async function deleteResume(
  userId: string,
  resumeId: string,
): Promise<void> {
  const resume = await Resume.findOne({ _id: resumeId, user: userId });
  if (!resume) {
    throw new AppError("Resume not found", 404);
  }

  await deleteFromCloudinary(resume.cloudinaryPublicId);

  await resume.deleteOne();
  await Analysis.deleteMany({ resume: resume._id });
  await User.findByIdAndUpdate(userId, { $inc: { resumeCount: -1 } });
}
