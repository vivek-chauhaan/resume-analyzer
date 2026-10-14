"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const upload_middleware_1 = require("../middleware/upload.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const resume_validator_1 = require("../validators/resume.validator");
const resume_controller_1 = require("../controllers/resume.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.requireAuth); // every resume route requires a logged-in user
router.post("/upload", upload_middleware_1.uploadSingleResume, resume_controller_1.uploadResume);
router.get("/", resume_validator_1.listResumesValidator, validation_middleware_1.handleValidation, resume_controller_1.listResumes);
router.get("/:id", resume_validator_1.resumeIdParamValidator, validation_middleware_1.handleValidation, resume_controller_1.getResumeById);
router.delete("/:id", resume_validator_1.resumeIdParamValidator, validation_middleware_1.handleValidation, resume_controller_1.deleteResume);
exports.default = router;
