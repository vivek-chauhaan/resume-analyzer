export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  resumeCount: number;
  lastAnalysisAt: string | null;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

// Matches the standard Express response envelope: { success, data, message }
export interface ApiEnvelope<T> {
  success: boolean;
  data: T;
  message: string;
  errors?: { field: string; message: string }[];
}
