import { Router } from "express";

import {
  runAnalysis,
  getAnalysis,
  runJobMatch,
} from "../controllers/analysis.controller";

import { requireAuth } from "../middleware/auth.middleware";

import { handleValidation } from "../middleware/validation.middleware";

import {
  resumeIdParamValidator,
  getAnalysisValidator,
  jobMatchValidator,
} from "../validators/analysis.validator";

const router = Router();

router.use(requireAuth);

// Run resume analysis
router.post(
  "/:resumeId",
  resumeIdParamValidator,
  handleValidation,
  runAnalysis,
);

// Get resume analysis
router.get("/:resumeId", getAnalysisValidator, handleValidation, getAnalysis);

// Job match
router.post(
  "/:resumeId/job-match",
  jobMatchValidator,
  handleValidation,
  runJobMatch,
);

export default router;
