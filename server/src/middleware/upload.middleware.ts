import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { resumeUpload } from "../config/multer";

// Wraps multer's single-file upload so its errors (wrong type, too large)
// come back in the same { success, data, message } envelope as everything else,
// instead of multer's default error shape.
export function uploadSingleResume(req: Request, res: Response, next: NextFunction) {
  const handler = resumeUpload.single("resume");

  handler(req, res, (err: unknown) => {
    if (!err) return next();

    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        success: false,
        data: null,
        message: "File too large. Max upload size is set by MAX_UPLOAD_MB.",
      });
    }

    const message = err instanceof Error ? err.message : "Upload failed";
    return res.status(400).json({ success: false, data: null, message });
  });
}
