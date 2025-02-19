import { NextFunction, Request, Response, Router } from "express";
import Url from "../models/Url.js";
import { redirectToOriginalUrl } from "../controllers/url.js";
const router = Router();

router.get("/:shortId", redirectToOriginalUrl);

export default router;
