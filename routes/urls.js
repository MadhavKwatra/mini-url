import { Router } from "express";
import { generateShortUrl } from "../controller/url.js";

const router = Router();

router.post("/shorten", generateShortUrl);

export default router;
