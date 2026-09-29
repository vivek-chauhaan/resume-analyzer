import axiosInstance from "./axiosInstance";
import {
  ApiEnvelope,
  AuthResponse,
  AuthUser,
  LoginPayload,
  RegisterPayload,
} from "../types/auth.types";

export async function registerRequest(payload: RegisterPayload): Promise<AuthResponse> {
  const res = await axiosInstance.post<ApiEnvelope<AuthResponse>>("/auth/register", payload);
  return res.data.data;
}

export async function loginRequest(payload: LoginPayload): Promise<AuthResponse> {
  const res = await axiosInstance.post<ApiEnvelope<AuthResponse>>("/auth/login", payload);
  return res.data.data;
}

export async function fetchProfileRequest(): Promise<AuthUser> {
  const res = await axiosInstance.get<ApiEnvelope<AuthUser>>("/auth/profile");
  return res.data.data;
}
