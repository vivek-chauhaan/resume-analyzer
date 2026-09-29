import axiosInstance from "./axiosInstance";
import { ApiEnvelope } from "../types/auth.types";
import { Resume, ResumeListParams, ResumeListResult } from "../types/resume.types";

export async function uploadResumeRequest(file: File): Promise<Resume> {
  const formData = new FormData();
  formData.append("resume", file);

  const res = await axiosInstance.post<ApiEnvelope<Resume>>("/resume/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
}

export async function fetchResumesRequest(params: ResumeListParams): Promise<ResumeListResult> {
  const res = await axiosInstance.get<ApiEnvelope<ResumeListResult>>("/resume", { params });
  return res.data.data;
}

export async function fetchResumeByIdRequest(id: string): Promise<Resume> {
  const res = await axiosInstance.get<ApiEnvelope<Resume>>(`/resume/${id}`);
  return res.data.data;
}

export async function deleteResumeRequest(id: string): Promise<void> {
  await axiosInstance.delete(`/resume/${id}`);
}
