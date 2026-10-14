"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analysis_controller_1 = require("../controllers/analysis.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const analysis_validator_1 = require("../validators/analysis.validator");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.requireAuth);
// Run resume analysis
router.post("/:resumeId", analysis_validator_1.resumeIdParamValidator, validation_middleware_1.handleValidation, analysis_controller_1.runAnalysis);
// Get resume analysis
router.get("/:resumeId", analysis_validator_1.getAnalysisValidator, validation_middleware_1.handleValidation, analysis_controller_1.getAnalysis);
// Job match
router.post("/:resumeId/job-match", analysis_validator_1.jobMatchValidator, validation_middleware_1.handleValidation, analysis_controller_1.runJobMatch);
exports.default = router;
