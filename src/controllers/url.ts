import { nanoid } from "nanoid";
import Url from "../models/Url.js";
import { validateUrl } from "../utils/utils.js";
import validator from "validator";
import { Request, Response, NextFunction } from "express";
import { logVisit } from "../services/logVisit.js";

export const generateShortUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { originalUrl } = req.body;

  const shortId = nanoid(6);
  if (
    originalUrl &&
    !validator.isEmpty(originalUrl) &&
    validateUrl(originalUrl)
  ) {
    try {
      const newUrl = new Url({
        originalUrl,
        shortId
      });

      await newUrl.save();
      res
        .status(201)
        .json({ data: newUrl, message: "URL Shortened Successfully" });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to shorten URL" });
    }
  } else {
    res
      .status(400)
      .json({ message: originalUrl ? "Invalid Url" : "Url is required" });
  }
};
export const getShortUrls = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });
    if (urls && urls.length > 0) {
      res
        .status(200)
        .json({ data: urls, message: "URLs fetched successfully" });
    } else {
      res.status(404).json({ data: [], message: "No URLs found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to Get URLs" });
  }
};

export const getAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: Implement analytics logic here
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add analytics" });
  }
};

export const redirectToOriginalUrl = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { shortId } = req.params;
    const url = await Url.findOne({ shortId });
    if (url) {
      // TODO: Update tracking Logic
      // await Url.updateOne(
      //   {
      //     shortId: req.params.shortId,
      //   },
      //   { $inc: { clicks: 1 } }
      // );

      // Fire And Forget
      logVisit(shortId, req);
      return res.redirect(url.originalUrl);
    } else res.status(404).json("Not found");
  } catch (err) {
    console.log(err);
    res.status(500).json("Failed to redirect to original URL");
  }
};
