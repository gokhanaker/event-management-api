import { Request, Response } from "express";
import { createEventSchema } from "../validation/EventValidation";
import {
  getEventById,
  createNewEvent,
  getFilteredEvents,
  deleteEventById,
  updateEventById,
} from "../service/EventService";

export const createEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("request came with body: ", req.body);

  try {
    const { error } = createEventSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) res.status(400).json({ error: "Invalid event format" });

    const { title, description, date, time, location, category, maxAttendees } =
      req.body;

    const event = await createNewEvent(
      title,
      description,
      date,
      time,
      location,
      category,
      maxAttendees
    );

    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ error: "failed to create the event" });
  }
};

export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, location, title } = req.query;

    const filteredEvents = await getFilteredEvents(
      category as string,
      location as string,
      title as string
    );
    res.status(200).json({ events: filteredEvents });
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve events" });
  }
};

export const getEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Event id is required" });

    const event = await getEventById(id as string);

    if (!event) {
      res.status(404).json({ error: "Event not found" });
    } else {
      res.status(200).json(event);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve event" });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Event id is required" });

    const { error } = createEventSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) res.status(400).json({ error: "Invalid event format" });

    const event = await updateEventById(id as string, req.body);
    return res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: "Failed to update event" });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ error: "Event id is required" });

    const event = await deleteEventById(id as string);
    return res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete event" });
  }
};
