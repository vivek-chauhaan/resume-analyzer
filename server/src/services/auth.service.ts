import { User, IUser } from "../models/User.model";
import { signToken } from "./token.service";

export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

function toPublicUser(user: IUser) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    avatar: user.avatar ?? null,
    resumeCount: user.resumeCount,
    lastAnalysisAt: user.lastAnalysisAt ?? null,
  };
}

export async function registerUser(input: RegisterInput) {
  const existing = await User.findOne({ email: input.email.toLowerCase() });
  if (existing) {
    throw new AppError("An account with this email already exists", 409);
  }

  const user = await User.create({
    name: input.name,
    email: input.email.toLowerCase(),
    password: input.password,
  });

  const token = signToken({ userId: user._id.toString() });
  return { user: toPublicUser(user), token };
}

export async function loginUser(input: LoginInput) {
  const user = await User.findOne({ email: input.email.toLowerCase() }).select("+password");
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isMatch = await user.comparePassword(input.password);
  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = signToken({ userId: user._id.toString() });
  return { user: toPublicUser(user), token };
}

export async function getUserProfile(userId: string) {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  return toPublicUser(user);
}
