import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/token.service";

export interface AuthedRequest extends Request {
  userId?: string;
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, data: null, message: "Not authenticated" });
  }

  const token = header.split(" ")[1];
  try {
    const payload = verifyToken(token);
    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ success: false, data: null, message: "Invalid or expired token" });
  }
}
