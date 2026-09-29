import { FilterQuery } from "mongoose";
import { Resume, IResume } from "../models/Resume.model";

export interface ResumeListQuery {
  page: number;
  limit: number;
  sortBy: "createdAt" | "originalFileName" | "status";
  order: "asc" | "desc";
  status?: string;
  search?: string;
}

export async function findResumesForUser(userId: string, query: ResumeListQuery) {
  const filter: FilterQuery<IResume> = { user: userId };

  if (query.status) {
    filter.status = query.status;
  }
  if (query.search) {
    filter.$text = { $search: query.search };
  }

  const sort: Record<string, 1 | -1> = { [query.sortBy]: query.order === "asc" ? 1 : -1 };
  const skip = (query.page - 1) * query.limit;

  const [items, total] = await Promise.all([
    Resume.find(filter).sort(sort).skip(skip).limit(query.limit),
    Resume.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page: query.page,
      totalPages: Math.max(1, Math.ceil(total / query.limit)),
      total,
    },
  };
}
