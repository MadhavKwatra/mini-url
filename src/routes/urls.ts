import { Router } from "express";
import {
  generateShortUrl,
  getAnalytics,
  getShortUrls
} from "../controllers/url.js";
import { verifyToken } from "../services/auth.js";

const router = Router();
router.use(verifyToken);
router.post("/shorten", generateShortUrl);
router.get("/urls", getShortUrls);
router.get("/analytics/:shortId", getAnalytics);
export default router;
