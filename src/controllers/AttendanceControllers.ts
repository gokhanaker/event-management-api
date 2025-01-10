import { attendEventService } from "../service/AttendanceService";
import { ERRORS } from "../constants/errors";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const attendEvent = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const userId = req.headers["user-id"] as unknown as mongoose.Types.ObjectId;
    const { eventId } = req.params;

    if (!eventId) {
      return res.status(400).json({ error: "Event id is missing" });
    }

    const attendance = await attendEventService(
      userId,
      new mongoose.Types.ObjectId(eventId),
    );
    return res
      .status(201)
      .json({ message: "User successfully attended the event", attendance });
  } catch (error: any) {
    if (error.message === ERRORS.USER_ALREADY_ATTENDING) {
      return res.status(400).json({ error: error.message });
    } else if (error.message === ERRORS.EVENT_FULL) {
      return res.status(403).json({ error: error.message });
    } else if (error.message === ERRORS.EVENT_NOT_FOUND) {
      return res.status(404).json({ error: error.message });
    }
    return res.status(500).json({ error: "Failed to attend to event" });
  }
};
