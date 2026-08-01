import mongoose from "mongoose";
import logger from "../utils/logger.js";

const connectDB = async () => {
  const { MONGO_URI } = process.env;
  if (!MONGO_URI) {
    throw new Error("MONGO_URI environment variable is not set.");
  }

  await mongoose.connect(MONGO_URI);
  logger.info("Connected to the database");
};

export default connectDB;
