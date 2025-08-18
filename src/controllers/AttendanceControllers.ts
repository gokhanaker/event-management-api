import { attendEventService } from "../service/AttendanceService";
import { successResponse } from "../utils/responseHandler";
import { asyncHandler } from "../middleware/errorHandler";
import { ValidationError } from "../utils/errorHandler";
import { AuthenticatedRequest } from "../types/express";
import logger from "../utils/logger";
import { Response } from "express";
import mongoose from "mongoose";

export const attendEvent = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { eventId } = req.params;

    if (!eventId) {
      throw new ValidationError("Event id is missing");
    }

    if (!req.user) {
      throw new ValidationError("User not authenticated");
    }

    const userId = new mongoose.Types.ObjectId(req.user.id);

    logger.info(
      `Attendance attempt by user ${req.user.id} for event ${eventId}`,
    );

    const attendance = await attendEventService(
      userId,
      new mongoose.Types.ObjectId(eventId),
    );

    logger.info(`User ${req.user.id} successfully attended event ${eventId}`);

    successResponse(
      res,
      { attendance },
      "User successfully attended the event",
      201,
    );
  },
);
