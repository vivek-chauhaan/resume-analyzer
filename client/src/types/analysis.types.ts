export interface SectionScores {
  contact: number;
  skills: number;
  education: number;
  experience: number;
  projects: number;
  certifications: number;
}

export interface KeywordAnalysis {
  matchedKeywords: string[];
  missingKeywords: string[];
  matchPercentage: number;
}

export interface AiInsights {
  extractedSkills: string[];
  semanticJobMatch: number | null;
  entities: { organizations: string[]; noun_phrases: string[] };
  modelVersion: string;
}

export interface Analysis {
  _id: string;
  resume: string;
  overallScore: number;
  sectionScores: SectionScores;
  keywordAnalysis: KeywordAnalysis;
  formattingScore: number;
  readabilityScore: number;
  aiInsights: AiInsights;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  summary: string;
  createdAt: string;
}
