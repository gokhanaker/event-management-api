import { successResponse } from "../utils/responseHandler";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const healthCheck = async (res: Response): Promise<void> => {
  const healthData = {
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    database: {
      status:
        mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    },
  };

  successResponse(res, healthData, "Health check successful");
};
