"use strict";
// import multer from "multer";
// import { Request } from "express";
// import { env } from "./env";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resumeUpload = void 0;
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
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
exports.resumeUpload = (0, multer_1.default)({
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
