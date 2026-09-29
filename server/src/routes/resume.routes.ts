import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { uploadSingleResume } from "../middleware/upload.middleware";
import { handleValidation } from "../middleware/validation.middleware";
import { listResumesValidator, resumeIdParamValidator } from "../validators/resume.validator";
import {
  uploadResume,
  listResumes,
  getResumeById,
  deleteResume,
} from "../controllers/resume.controller";

const router = Router();

router.use(requireAuth); // every resume route requires a logged-in user

router.post("/upload", uploadSingleResume, uploadResume);
router.get("/", listResumesValidator, handleValidation, listResumes);
router.get("/:id", resumeIdParamValidator, handleValidation, getResumeById);
router.delete("/:id", resumeIdParamValidator, handleValidation, deleteResume);

export default router;
