import Event, { IEvent } from "../models/Event";

export const createNewEventService = async (
  title: string,
  description: string,
  date: Date,
  time: string,
  location: string,
  category: string,
  maxAttendees: number
): Promise<IEvent> => {
  const event = new Event({
    title,
    description,
    date,
    time,
    location,
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
