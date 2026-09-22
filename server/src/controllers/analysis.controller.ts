import { Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { AuthedRequest } from "../middleware/auth.middleware";
import * as analysisService from "../services/analysis.service";

export const runAnalysis = catchAsync(async (req: AuthedRequest, res: Response) => {
  const analysis = await analysisService.runAnalysis(req.userId as string, req.params.resumeId);
  res.status(201).json({ success: true, data: analysis, message: "Analysis complete" });
});

export const getAnalysis = catchAsync(async (req: AuthedRequest, res: Response) => {
  const all = (req.query.all as unknown as boolean) === true;
  const result = await analysisService.getAnalysis(req.userId as string, req.params.resumeId, all);
  res.status(200).json({ success: true, data: result, message: "Analysis fetched" });
});
