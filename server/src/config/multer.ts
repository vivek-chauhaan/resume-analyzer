import multer from "multer";
import path from "path";
import fs from "fs";
import { Request } from "express";
import { env } from "./env";

const UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads", "resumes");

// Make sure the folder exists (matters on a fresh clone before first run)
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req: Request & { userId?: string }, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const safeUserId = req.userId || "anon";
    cb(null, `${safeUserId}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

function fileFilter(_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  if (file.mimetype !== "application/pdf") {
    cb(new Error("Only PDF files are allowed"));
    return;
  }
  cb(null, true);
}

export const resumeUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: env.maxUploadMb * 1024 * 1024 },
});

export const RESUME_UPLOAD_DIR = UPLOAD_DIR;
