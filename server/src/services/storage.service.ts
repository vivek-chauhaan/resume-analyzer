import streamifier from "streamifier";
import cloudinary from "../config/cloudinary";

export interface UploadResult {
  url: string;
  publicId: string;
}

export function uploadBufferToCloudinary(
  buffer: Buffer,
  folder: string,
  fileName: string,
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder,
        public_id: fileName,
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error("Cloudinary upload failed"));
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      },
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
  } catch {
    // already deleted or inaccessible — ignore, don't block the DB delete
  }
}
