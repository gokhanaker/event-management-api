import logger from "../utils/logger";
import mongoose from "mongoose";
import { config } from "./env";

const connectDB = async (): Promise<void> => {
  try {
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(config.MONGO_URI, options);
    logger.info("✅ MongoDB connected successfully");

    mongoose.connection.on("error", (err) => {
      logger.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("⚠️ MongoDB disconnected");
    });
  } catch (err) {
    logger.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1);
  }
};

export default connectDB;
