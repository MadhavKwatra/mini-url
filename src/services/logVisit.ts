import { Request } from "express";
import geoip from "geoip-lite";
import Visit from "../models/Visit.js";
export const logVisit = async (shortId: string, req: Request) => {
  try {
    console.log(
      "LogVisit called ",
      shortId,
      req.ip,
      req.headers,
      process.env.NODE_ENV
    );

    const ip =
      req.ip ||
      req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim();

    // Default to unknown if IP is not available
    const unknownGeo = {
      country: "Unknown",
      city: "Unknown",
      region: "Unknown"
    };
    const geo =
      process.env.NODE_ENV === "development"
        ? {
            country: "localhost",
            region: "localhost",
            city: "localhost"
          }
        : ip
        ? geoip.lookup(ip) || unknownGeo
        : unknownGeo;

    const newVisit = new Visit({
      shortId,
      ipAddress: ip,
      userAgent: req.headers["user-agent"] || "Unknown",
      referrer: req.headers["referer"] || "Direct",
      country: geo.country,
      state: geo.region,
      city: geo.city
    });
    await newVisit.save();
    console.log("Visit logged successfully", newVisit);
  } catch (error) {
    console.error("Error in logVisit:", error);
  }
};
