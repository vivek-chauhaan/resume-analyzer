import { Router } from "express";
import rateLimit from "express-rate-limit";
import { resumeUpload } from "../config/multer";
import { analyzeGuestResume } from "../controllers/publicAnalysis.controller";

const router = Router();

const guestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 free tries per IP per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    data: null,
    message: "You've hit the free-trial limit. Sign up for unlimited analyses.",
  },
});

router.post(
  "/analyze",
  guestLimiter,
  resumeUpload.single("resume"),
  analyzeGuestResume,
);

export default router;
