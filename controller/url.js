import { nanoid } from "nanoid";
import Url from "../models/Url.js";
import { validateUrl } from "../utils/utils.js";
import validator from "validator";

export const generateShortUrl = async (req, res, next) => {
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
        shortId,
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
    return res
      .status(400)
      .json({ message: originalUrl ? "Invalid Url" : "Url is required" });
  }
};
export const getShortUrls = async (req, res, next) => {
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

export const getAnalytics = async (req, res, next) => {
  try {
    // TODO: Implement analytics logic here
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add analytics" });
  }
};
