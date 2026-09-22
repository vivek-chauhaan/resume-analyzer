import { param, query } from "express-validator";

export const resumeIdParamValidator = [
  param("resumeId").isMongoId().withMessage("Invalid resume id"),
];

export const getAnalysisValidator = [
  param("resumeId").isMongoId().withMessage("Invalid resume id"),
  query("all").optional().isBoolean().toBoolean(),
];
