import { nanoid } from "nanoid";
import Url from "../models/Url.js";
import { validateUrl } from "../utils/utils.js";
import validator from "validator";

export const generateShortUrl = async (req, res, next) => {
  const { originalUrl } = req.body;
  const base = process.env.BASE;

  const urlId = nanoid(6);
  if (
    originalUrl &&
    !validator.isEmpty(originalUrl) &&
    validateUrl(originalUrl)
  ) {
    try {
      let url = await Url.findOne({ originalUrl });
      if (url) {
        res.status(200).json({ data: url, message: "URL Already Shortened" });
      } else {
        const shortUrl = `${base}/${urlId}`;

        url = new Url({
          originalUrl,
          shortUrl,
          urlId,
        });

        await url.save();
        res
          .status(201)
          .json({ data: url, message: "URL Shortened Successfully" });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server Error" });
    }
  } else {
    res.status(400).json({ message: "Invalid Original Url" });
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
      res.status(404).json({ message: "No URLs found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};
