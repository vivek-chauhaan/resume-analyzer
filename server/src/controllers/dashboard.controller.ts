import { Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { AuthedRequest } from "../middleware/auth.middleware";
import { getDashboardStats } from "../services/dashboard.service";

export const getStats = catchAsync(async (req: AuthedRequest, res: Response) => {
  const stats = await getDashboardStats(req.userId as string);
  res.status(200).json({ success: true, data: stats, message: "Dashboard stats fetched" });
});