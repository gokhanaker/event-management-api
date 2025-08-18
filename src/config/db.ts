import { config } from "@/config/env";
import logger from "@/utils/logger";
import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const options = {
      maxPoolSize: 10, // Maximum number of connections in the pool
      socketTimeoutMS: 45000, // Timeout for socket connection
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
