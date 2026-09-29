import { Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { registerUser, loginUser, getUserProfile } from "../services/auth.service";
import { AuthedRequest } from "../middleware/auth.middleware";

export const register = catchAsync(async (req, res: Response) => {
  const { name, email, password } = req.body;
  const result = await registerUser({ name, email, password });
  res.status(201).json({ success: true, data: result, message: "Account created successfully" });
});

export const login = catchAsync(async (req, res: Response) => {
  const { email, password } = req.body;
  const result = await loginUser({ email, password });
  res.status(200).json({ success: true, data: result, message: "Logged in successfully" });
});

export const getProfile = catchAsync(async (req: AuthedRequest, res: Response) => {
  const profile = await getUserProfile(req.userId as string);
  res.status(200).json({ success: true, data: profile, message: "Profile fetched" });
});
