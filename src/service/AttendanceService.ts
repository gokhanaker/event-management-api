import Attendance, { IAttendance } from "../models/Attendence";
import { ERRORS } from "../constants/errors";
import Event from "../models/Event";
import mongoose from "mongoose";

export const attendEventService = async (
  userId: mongoose.Types.ObjectId,
  eventId: mongoose.Types.ObjectId,
): Promise<IAttendance> => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error(ERRORS.EVENT_NOT_FOUND);
  }

  const existingAttendance = await Attendance.findOne({
    user: userId,
    event: eventId,
  });

  if (existingAttendance) {
    throw new Error(ERRORS.USER_ALREADY_ATTENDING);
  }

  // Check if the event has reached its max attendees
  const currentAttendees = await Attendance.countDocuments({ event: eventId });
  if (currentAttendees >= event.maxAttendees) {
    throw new Error(ERRORS.EVENT_FULL);
  }

  const attendance = new Attendance({
    userId,
    eventId,
  });

  return await attendance.save();
};
