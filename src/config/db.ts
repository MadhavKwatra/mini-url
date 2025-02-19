import { connect } from "mongoose";

const connectDb = async () => {
  try {
    await connect(process.env.MONGO_URI);
    console.log("DB Connected!");
  } catch (error) {
    console.log(error);
  }
};

export default connectDb;
