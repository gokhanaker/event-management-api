import { NotFoundError, AuthorizationError } from "@/utils/errorHandler";
import Event from "@/models/Event";
import mongoose from "mongoose";

export const createNewEventService = async (
  userId: mongoose.Types.ObjectId,
  userRole: string,
  title: string,
  description: string,
  date: Date,
  location: string,
  category: string,
  maxAttendees: number,
) => {
  const event = new Event({
    title,
    description,
    date,
    location,
    category,
    maxAttendees,
    organizer: userId,
  });

  return await event.save();
};

export const getFilteredEventsService = async (
  category?: string,
  location?: string,
  title?: string,
  startDate?: string,
  endDate?: string,
) => {
  const filter: any = {};

  if (category) {
    filter.category = category;
  }

  if (location) {
    filter.location = { $regex: location, $options: "i" };
  }

  if (title) {
    filter.title = { $regex: title, $options: "i" };
  }

  if (startDate || endDate) {
    filter.date = {};
    if (startDate) {
      filter.date.$gte = new Date(startDate);
    }
    if (endDate) {
      filter.date.$lte = new Date(endDate);
    }
  }

  return await Event.find(filter).populate("organizer", "username email");
};

export const getEventByIdService = async (eventId: string) => {
  const event = await Event.findById(eventId).populate(
    "organizer",
    "username email",
  );

  if (!event) {
    throw new NotFoundError("Event not found");
  }

  return event;
};

export const updateEventByIdService = async (
  eventId: string,
  updateData: any,
  userId: mongoose.Types.ObjectId,
  userRole: string,
) => {
  const event = await Event.findById(eventId);

  if (!event) {
    throw new NotFoundError("Event not found");
  }

  if (
    userRole !== "admin" &&
    event.organizer.toString() !== userId.toString()
  ) {
    throw new AuthorizationError("You can only update your own events");
  }

  const updatedEvent = await Event.findByIdAndUpdate(eventId, updateData, {
    new: true,
  }).populate("organizer", "username email");

  return updatedEvent;
};

export const deleteEventByIdService = async (
  eventId: string,
  userId: mongoose.Types.ObjectId,
  userRole: string,
) => {
  const event = await Event.findById(eventId);

  if (!event) {
    throw new NotFoundError("Event not found");
  }

  if (
    userRole !== "admin" &&
    event.organizer.toString() !== userId.toString()
  ) {
    throw new AuthorizationError("You can only delete your own events");
  }

  const deletedEvent = await Event.findByIdAndDelete(eventId).populate(
    "organizer",
    "username email",
  );

  return deletedEvent;
};
