import axiosInstance from "./axiosInstance";
import { ApiEnvelope } from "../types/auth.types";
import { DashboardStats } from "../types/dashboard.types";

export async function fetchDashboardStatsRequest(): Promise<DashboardStats> {
  const res = await axiosInstance.get<ApiEnvelope<DashboardStats>>("/dashboard/stats");
  return res.data.data;
}