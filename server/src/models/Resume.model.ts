import { Schema, model, Document, Types } from "mongoose";

export type ResumeStatus = "uploaded" | "analyzing" | "analyzed" | "failed";

export interface IResume extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  originalFileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  extractedText: string;
  status: ResumeStatus;
  latestAnalysis: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const resumeSchema = new Schema<IResume>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    originalFileName: { type: String, required: true },
    filePath: { type: String, required: true },
    fileSize: { type: Number, required: true },
    mimeType: { type: String, required: true },
    extractedText: { type: String, default: "" },
    status: {
      type: String,
      enum: ["uploaded", "analyzing", "analyzed", "failed"],
      default: "uploaded",
    },
    latestAnalysis: { type: Schema.Types.ObjectId, ref: "Analysis", default: null },
  },
  { timestamps: true }
);

resumeSchema.index({ user: 1, createdAt: -1 });
resumeSchema.index({ extractedText: "text" });

export const Resume = model<IResume>("Resume", resumeSchema);
