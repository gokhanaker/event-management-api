import { ConflictError, NotFoundError } from "@/utils/errorHandler";
import Attendance from "@/models/Attendance";
import Event from "@/models/Event";
import mongoose from "mongoose";

export const attendEventService = async (
  userId: mongoose.Types.ObjectId,
  eventId: mongoose.Types.ObjectId,
) => {
  const event = await Event.findById(eventId);

  if (!event) {
    throw new NotFoundError("Event not found");
  }

  const existingAttendance = await Attendance.findOne({
    userId: userId,
    eventId: eventId,
  });

  if (existingAttendance) {
    throw new ConflictError("User is already registered for this event");
  }

  const attendance = new Attendance({
    userId: userId,
    eventId: eventId,
  });

  return await attendance.save();
};
