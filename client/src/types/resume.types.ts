export type ResumeStatus = "uploaded" | "analyzing" | "analyzed" | "failed";

export interface Resume {
  _id: string;
  user: string;
  originalFileName: string;
  fileSize: number;
  mimeType: string;
  status: ResumeStatus;
  latestAnalysis: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeListResult {
  items: Resume[];
  pagination: { page: number; totalPages: number; total: number };
}

export interface ResumeListParams {
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "originalFileName" | "status";
  order?: "asc" | "desc";
  status?: ResumeStatus;
  search?: string;
}
