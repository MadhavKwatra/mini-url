import { Router } from "express";
import {
  forgotPassword,
  handleUserLogIn,
  handleUserSignUp,
  resetPassword,
  verifyEmail
} from "../controllers/user.js";

const router = Router();

router.post("/sign-up", handleUserSignUp);
router.post("/log-in", handleUserLogIn);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
export default router;
