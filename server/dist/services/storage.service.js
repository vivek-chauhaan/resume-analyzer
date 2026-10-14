"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadBufferToCloudinary = uploadBufferToCloudinary;
exports.deleteFromCloudinary = deleteFromCloudinary;
const streamifier_1 = __importDefault(require("streamifier"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
function uploadBufferToCloudinary(buffer, folder, fileName) {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.default.uploader.upload_stream({
            resource_type: "raw",
            folder,
            public_id: fileName,
        }, (error, result) => {
            if (error || !result) {
                return reject(error || new Error("Cloudinary upload failed"));
            }
            resolve({ url: result.secure_url, publicId: result.public_id });
        });
        streamifier_1.default.createReadStream(buffer).pipe(uploadStream);
    });
}
async function deleteFromCloudinary(publicId) {
    try {
        await cloudinary_1.default.uploader.destroy(publicId, { resource_type: "raw" });
    }
    catch {
        // already deleted or inaccessible — ignore, don't block the DB delete
    }
}
