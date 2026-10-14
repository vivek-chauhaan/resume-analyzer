"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadSingleResume = uploadSingleResume;
const multer_1 = __importDefault(require("multer"));
const multer_2 = require("../config/multer");
// Wraps multer's single-file upload so its errors (wrong type, too large)
// come back in the same { success, data, message } envelope as everything else,
// instead of multer's default error shape.
function uploadSingleResume(req, res, next) {
    const handler = multer_2.resumeUpload.single("resume");
    handler(req, res, (err) => {
        if (!err)
            return next();
        if (err instanceof multer_1.default.MulterError && err.code === "LIMIT_FILE_SIZE") {
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
