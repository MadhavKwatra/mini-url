import { Router } from "express";
import Url from "../models/Url.js";
const router = Router();

router.get("/:urlId", async (req, res, next) => {
  try {
    const url = await Url.findOne({ urlId: req.params.urlId });
    console.log("urlID param", req.params.urlId);
    if (url) {
      await Url.updateOne(
        {
          urlId: req.params.urlId,
        },
        { $inc: { clicks: 1 } }
      );
      return res.redirect(url.originalUrl);
    } else res.status(404).json("Not found");
  } catch (err) {
    console.log(err);
    res.status(500).json("Server Error");
  }
});

export default router;
