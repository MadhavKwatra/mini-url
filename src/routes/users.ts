import { Router } from "express";
import {
  handleUserLogIn,
  handleUserSignUp,
  verifyEmail
} from "../controllers/user.js";

const router = Router();

router.post("/sign-up", handleUserSignUp);
router.post("/log-in", handleUserLogIn);
router.get("/verify-email", verifyEmail);
export default router;
