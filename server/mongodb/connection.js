import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    // .then(() => {
    //   console.log("MongoDB connect successfully.");
    console.log("MongoDB is connected");
  } catch (error) {
    console.log("Error in Connecting MongoDB");
  }
};

export default connectDB;
