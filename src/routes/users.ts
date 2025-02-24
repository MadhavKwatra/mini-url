import { Router } from "express";
import { handleUserLogIn, handleUserSignUp } from "../controllers/user.js";

const router = Router();

router.post("/sign-up", handleUserSignUp);
router.post("/log-in", handleUserLogIn);
export default router;
