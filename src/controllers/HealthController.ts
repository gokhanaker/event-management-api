import { successResponse } from "../utils/responseHandler";
import { asyncHandler } from "../middleware/errorHandler";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const healthCheck = asyncHandler(async (req: Request, res: Response) => {
  const healthData = {
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
    database: {
      status:
        mongoose.connection.readyState === 1 ? "connected" : "disconnected",
      name: mongoose.connection.name,
    },
  };

  successResponse(res, healthData, "Health check successful");
});
