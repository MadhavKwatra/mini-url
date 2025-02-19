import { Router } from "express";
import Url from "../models/Url.js";
const router = Router();

router.get("/:shortId", async (req, res, next) => {
  try {
    const url = await Url.findOne({ shortId: req.params.shortId });
    if (url) {
      // TODO: Update tracking Logic
      // await Url.updateOne(
      //   {
      //     shortId: req.params.shortId,
      //   },
      //   { $inc: { clicks: 1 } }
      // );
      return res.redirect(url.originalUrl);
    } else res.status(404).json("Not found");
  } catch (err) {
    console.log(err);
    res.status(500).json("Failed to redirect to original URL");
  }
});

export default router;
