import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { handleValidation } from "../middleware/validation.middleware";
import { resumeIdParamValidator, getAnalysisValidator } from "../validators/analysis.validator";
import { runAnalysis, getAnalysis } from "../controllers/analysis.controller";

const router = Router();

router.use(requireAuth);

router.post("/:resumeId", resumeIdParamValidator, handleValidation, runAnalysis);
router.get("/:resumeId", getAnalysisValidator, handleValidation, getAnalysis);
// Day 6 adds: POST /:resumeId/job-match

export default router;
