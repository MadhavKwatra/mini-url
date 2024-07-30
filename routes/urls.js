import { Router } from "express";
import { generateShortUrl,getShortUrls } from "../controller/url.js";

const router = Router();

router.post("/shorten", generateShortUrl);
router.get("/urls", getShortUrls);

export default router;
