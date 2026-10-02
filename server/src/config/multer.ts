// import multer from "multer";
// import { Request } from "express";
// import { env } from "./env";

// // memoryStorage: file disk pe kabhi nahi jaati — buffer directly RAM mein
// // milta hai, jise hum Cloudinary ko stream kar denge.
// const storage = multer.memoryStorage();

// function fileFilter(
//   _req: Request,
//   file: Express.Multer.File,
//   cb: multer.FileFilterCallback,
// ) {
//   if (file.mimetype !== "application/pdf") {
//     cb(new Error("Only PDF files are allowed"));
//     return;
//   }
//   cb(null, true);
// }

// export const resumeUpload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: env.maxUploadMb * 1024 * 1024 },
// });

import multer from "multer";

const storage = multer.memoryStorage();

export const resumeUpload = multer({
  storage,
  limits: {
    fileSize: Number(process.env.MAX_UPLOAD_MB || 5) * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      cb(new Error("Only PDF files are allowed"));
      return;
    }
    cb(null, true);
  },
});
