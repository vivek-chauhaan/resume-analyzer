export interface LatestAnalysisPreview {
  resumeId: string;
  fileName: string;
  overallScore: number;
  summary: string;
  suggestions: string[];
  createdAt: string;
}

export interface DashboardStats {
  totalResumes: number;
  analyzedCount: number;
  averageScore: number | null;
  bestScore: number | null;
  lastAnalysisAt: string | null;
  latest: LatestAnalysisPreview | null;
}