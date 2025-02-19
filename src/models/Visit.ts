import mongoose, { Document, Schema } from "mongoose";

export interface Visit extends Document {
  shortId: string;
  userAgent?: string;
  ipAddress?: string;
  referrer?: string;
  country?: string;
  state?: string;
  city?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const VisitSchema = new Schema<Visit>(
  {
    shortId: { type: String, required: true, index: true },
    userAgent: { type: String },
    ipAddress: { type: String },
    referrer: { type: String },
    country: { type: String },
    state: { type: String },
    city: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model<Visit>("Visit", VisitSchema);
