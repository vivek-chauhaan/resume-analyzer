import axiosInstance from "./axiosInstance";
import { ApiEnvelope } from "../types/auth.types";
import { Analysis } from "../types/analysis.types";

export async function runAnalysisRequest(resumeId: string): Promise<Analysis> {
  const res = await axiosInstance.post<ApiEnvelope<Analysis>>(`/analysis/${resumeId}`);
  return res.data.data;
}

export async function fetchAnalysisRequest(resumeId: string): Promise<Analysis> {
  const res = await axiosInstance.get<ApiEnvelope<Analysis>>(`/analysis/${resumeId}`);
  return res.data.data;
}

export async function runJobMatchRequest(
  resumeId: string,
  jobDescription: string
): Promise<Analysis> {
  const res = await axiosInstance.post<ApiEnvelope<Analysis>>(
    `/analysis/${resumeId}/job-match`,
    { jobDescription }
  );
  return res.data.data;
}