import mongoose from "mongoose";
export interface User extends Document {
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  verificationToken?: string;
}
const UserSchema = new mongoose.Schema<User>(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, default: null }
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
