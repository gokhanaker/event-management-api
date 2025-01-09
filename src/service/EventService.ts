import mongoose from "mongoose";
import Event, { IEvent } from "../models/Event";
import { Role } from "../validation/AuthValidation";

export const createNewEventService = async (
  organizer: mongoose.Types.ObjectId,
  userRole: string,
  title: string,
  description: string,
  date: Date,
  location: string,
  category: string,
  maxAttendees: number
): Promise<IEvent> => {
  if (userRole !== "organizer" && userRole !== "admin") {
    throw new Error("User role is not valid to create a new event");
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
  title: string | undefined
): Promise<IEvent[]> => {
  const filters: any = {};
  if (category) filters.category = category;
  if (location) filters.location = { $regex: location, $options: "i" }; // i for case-insensitive
  if (title) filters.title = { $regex: title, $options: "i" };

  return await Event.find(filters);
};

export const getEventByIdService = async (
  id: string
): Promise<IEvent | null> => {
  const event = await Event.findById(id);
  return event;
};

export const updateEventByIdService = async (
  id: string,
  event: IEvent
): Promise<IEvent | null> => {
  const updatedEvent = await Event.findByIdAndUpdate(id, event);
  return updatedEvent;
};

export const deleteEventByIdService = async (
  id: string
): Promise<IEvent | null> => {
  const event = await Event.findByIdAndDelete(id);
  return event;
};
