import Attendence, { IAttendance } from "../models/Attendence";
import Event from "../models/Event";
import mongoose from "mongoose";

export const attendEventService = async (
  userId: mongoose.Types.ObjectId,
  eventId: mongoose.Types.ObjectId,
): Promise<IAttendance> => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error("Event not found");
  }

  const existingAttendance = await Attendence.findOne({
    user: userId,
    event: eventId,
  });

  if (existingAttendance) {
    throw new Error("User is already attending this event");
  }

  const attendance = new Attendence({
    userId,
    eventId,
  });

  return await attendance.save();
};
