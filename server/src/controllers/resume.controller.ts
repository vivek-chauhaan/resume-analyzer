import { Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { AuthedRequest } from "../middleware/auth.middleware";
import * as resumeService from "../services/resume.service";
import { AppError } from "../services/auth.service";

export const uploadResume = catchAsync(async (req: AuthedRequest, res: Response) => {
  if (!req.file) {
    throw new AppError("No file uploaded. Attach a PDF under the 'resume' field.", 400);
  }

  const resume = await resumeService.uploadResume({
    userId: req.userId as string,
    originalFileName: req.file.originalname,
    filePath: req.file.path,
    fileSize: req.file.size,
    mimeType: req.file.mimetype,
  });

  res.status(201).json({ success: true, data: resume, message: "Resume uploaded successfully" });
});

export const listResumes = catchAsync(async (req: AuthedRequest, res: Response) => {
  const { page = 1, limit = 10, sortBy = "createdAt", order = "desc", status, search } = req.query;

  const result = await resumeService.listResumes(req.userId as string, {
    page: Number(page),
    limit: Number(limit),
    sortBy: sortBy as any,
    order: order as any,
    status: status as string | undefined,
    search: search as string | undefined,
  });

  res.status(200).json({ success: true, data: result, message: "Resumes fetched" });
});

export const getResumeById = catchAsync(async (req: AuthedRequest, res: Response) => {
  const resume = await resumeService.getResumeById(req.userId as string, req.params.id);
  res.status(200).json({ success: true, data: resume, message: "Resume fetched" });
});

export const deleteResume = catchAsync(async (req: AuthedRequest, res: Response) => {
  await resumeService.deleteResume(req.userId as string, req.params.id);
  res.status(200).json({ success: true, data: null, message: "Resume deleted" });
});
