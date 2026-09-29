import { query, param } from "express-validator";

export const listResumesValidator = [
  query("page").optional().isInt({ min: 1 }).toInt(),
  query("limit").optional().isInt({ min: 1, max: 50 }).toInt(),
  query("sortBy").optional().isIn(["createdAt", "originalFileName", "status"]),
  query("order").optional().isIn(["asc", "desc"]),
  query("status").optional().isIn(["uploaded", "analyzing", "analyzed", "failed"]),
  query("search").optional().isString().trim(),
];

export const resumeIdParamValidator = [param("id").isMongoId().withMessage("Invalid resume id")];
