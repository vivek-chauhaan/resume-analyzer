import { Schema, model, Document, Types } from "mongoose";

interface SectionScores {
  contact: number;
  skills: number;
  education: number;
  experience: number;
  projects: number;
  certifications: number;
}

interface AiInsights {
  extractedSkills: string[];
  semanticJobMatch: number | null;
  entities: {
    organizations: string[];
    noun_phrases: string[];
  };
  modelVersion: string; // "all-MiniLM-L6-v2" or "unavailable"
}

interface KeywordAnalysis {
  matchedKeywords: string[];
  missingKeywords: string[];
  matchPercentage: number;
}

export interface IAnalysis extends Document {
  _id: Types.ObjectId;
  resume: Types.ObjectId;
  user: Types.ObjectId;
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
  createdAt: Date;
  updatedAt: Date;
}

const analysisSchema = new Schema<IAnalysis>(
  {
    resume: {
      type: Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
      index: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    overallScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    sectionScores: {
      contact: { type: Number, default: 0 },
      skills: { type: Number, default: 0 },
      education: { type: Number, default: 0 },
      experience: { type: Number, default: 0 },
      projects: { type: Number, default: 0 },
      certifications: { type: Number, default: 0 },
    },

    keywordAnalysis: {
      matchedKeywords: { type: [String], default: [] },
      missingKeywords: { type: [String], default: [] },
      matchPercentage: { type: Number, default: 0 },
    },

    formattingScore: {
      type: Number,
      default: 0,
    },

    readabilityScore: {
      type: Number,
      default: 0,
    },

    aiInsights: {
      extractedSkills: {
        type: [String],
        default: [],
      },

      semanticJobMatch: {
        type: Number,
        default: null,
      },

      entities: {
        organizations: {
          type: [String],
          default: [],
        },

        noun_phrases: {
          type: [String],
          default: [],
        },
      },

      modelVersion: {
        type: String,
        default: "unavailable",
      },
    },

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    suggestions: {
      type: [String],
      default: [],
    },

    summary: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

analysisSchema.index({ user: 1, createdAt: -1 });

export const Analysis = model<IAnalysis>("Analysis", analysisSchema);
