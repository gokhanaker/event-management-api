import Event, { IEvent } from "../models/Event";
import { ERRORS } from "../constants/errors";
import mongoose from "mongoose";

export const createNewEventService = async (
  organizer: mongoose.Types.ObjectId,
  userRole: string,
  title: string,
  description: string,
  date: Date,
  location: string,
  category: string,
  maxAttendees: number,
): Promise<IEvent> => {
  if (userRole !== "organizer" && userRole !== "admin") {
    throw new Error(ERRORS.FORBIDDEN);
  }

  const event = new Event({
    title,
    description,
    date,
    location,
    organizer,
    category,
    maxAttendees,
  });

  await event.save();
  return event;
};

export const getFilteredEventsService = async (
  category: string | undefined,
  location: string | undefined,
  title: string | undefined,
  startDate: string | undefined,
  endDate: string | undefined,
): Promise<IEvent[]> => {
  const filters: any = {};
  if (category) filters.category = category;
  if (location) filters.location = { $regex: location, $options: "i" }; // i for case-insensitive
  if (title) filters.title = { $regex: title, $options: "i" };

  // Add date range filter
  if (startDate || endDate) {
    filters.date = {};
    if (startDate) filters.date.$gte = new Date(startDate); // Greater than or equal to startDate
    if (endDate) filters.date.$lte = new Date(endDate); // Less than or equal to endDate
  }

  return await Event.find(filters);
};

export const getEventByIdService = async (
  id: string,
): Promise<IEvent | null> => {
  return await Event.findById(id);
};

export const updateEventByIdService = async (
  id: string,
  event: IEvent,
  userId: mongoose.Types.ObjectId,
  userRole: string,
): Promise<IEvent | null> => {
  const eventFromDb = await Event.findById(id);
  if (!eventFromDb) {
    throw new Error(ERRORS.EVENT_NOT_FOUND);
  }

  if (!eventFromDb.organizer.equals(userId) && userRole !== "admin") {
    throw new Error(ERRORS.FORBIDDEN);
  }

  return await Event.findByIdAndUpdate(
    id,
    { $set: event }, // Only update the provided fields
    { new: true }, // Return the updated document
  );
};

export const deleteEventByIdService = async (
  id: string,
  userId: mongoose.Types.ObjectId,
  userRole: string,
): Promise<IEvent | null> => {
  const event = await Event.findById(id);
  if (!event) {
    throw new Error(ERRORS.EVENT_NOT_FOUND);
  }

  if (!event.organizer.equals(userId) && userRole !== "admin") {
    throw new Error(ERRORS.FORBIDDEN);
  }

  const deletedEvent = await Event.findByIdAndDelete(id);
  return deletedEvent;
};
