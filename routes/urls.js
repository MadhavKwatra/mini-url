import { Router } from "express";
import {
  generateShortUrl,
  getAnalytics,
  getShortUrls,
} from "../controller/url.js";

const router = Router();

router.post("/shorten", generateShortUrl);
router.get("/urls", getShortUrls);
router.get("/analytics/:shortId", getAnalytics);
export default router;
