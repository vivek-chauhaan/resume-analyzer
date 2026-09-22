import { Request, Response, NextFunction } from "express";
import { AppError } from "../services/auth.service";

// 404 handler - no route matched
export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    data: null,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

// Central error handler - must be registered LAST, after all routes
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) {
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;
  const message = isAppError ? err.message : "Something went wrong on our end";

  if (!isAppError) {
    // Log full detail server-side only; never leak stack traces to the client
    console.error("[unhandled error]", err);
  }

  res.status(statusCode).json({
    success: false,
    data: null,
    message,
  });
}
