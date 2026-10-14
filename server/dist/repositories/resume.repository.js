"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findResumesForUser = findResumesForUser;
const Resume_model_1 = require("../models/Resume.model");
async function findResumesForUser(userId, query) {
    const filter = { user: userId };
    if (query.status) {
        filter.status = query.status;
    }
    if (query.search) {
        filter.$text = { $search: query.search };
    }
    const sort = { [query.sortBy]: query.order === "asc" ? 1 : -1 };
    const skip = (query.page - 1) * query.limit;
    const [items, total] = await Promise.all([
        Resume_model_1.Resume.find(filter).sort(sort).skip(skip).limit(query.limit),
        Resume_model_1.Resume.countDocuments(filter),
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
