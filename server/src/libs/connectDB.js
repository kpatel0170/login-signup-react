import mongoose from "mongoose";
import logger from "./logger.js";
import config from "../config/config.js";

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoose.url).then(() => {
      logger.info("Connected to MongoDB");
    });
  } catch (error) {
    logger.error("Could not connect to db");
    setTimeout(connectDB, 5000);
    process.exit(1);
  }
};

export default connectDB;
