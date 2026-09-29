import { Router } from "express";
import { register, login, getProfile } from "../controllers/auth.controller";
import { registerValidator, loginValidator } from "../validators/auth.validator";
import { handleValidation } from "../middleware/validation.middleware";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", registerValidator, handleValidation, register);
router.post("/login", loginValidator, handleValidation, login);
router.get("/profile", requireAuth, getProfile);

export default router;
