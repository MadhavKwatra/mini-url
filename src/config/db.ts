import { connect } from "mongoose";

const connectDb = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is available in env");
    }
    await connect(process.env.MONGO_URI);
    console.log("DB Connected!");
  } catch (error) {
    console.log(error);
  }
};

export default connectDb;
