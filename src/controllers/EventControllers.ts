import { Request, Response } from "express";
import {
  createEventSchema,
  filterEventsSchema,
} from "../validation/EventValidation";
import {
  getEventByIdService,
  createNewEventService,
  getFilteredEventsService,
  deleteEventByIdService,
  updateEventByIdService,
} from "../service/EventService";
import mongoose from "mongoose";

export const createEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { error } = createEventSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) res.status(400).json({ error: "Invalid event format" });

    const userId = req.headers["user-id"] as unknown as mongoose.Types.ObjectId; // Access the user ID from headers
    const userRole = req.headers["user-role"] as string; // Access the user role from headers

    const { title, description, date, location, category, maxAttendees } =
      req.body;

    const event = await createNewEventService(
      userId,
      userRole,
      title,
      description,
      date,
      location,
      category,
      maxAttendees
    );

    res.status(201).json(event);
  } catch (error: any) {
    if (error.message === "User role is not valid to create a new event") {
      res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: "Failed to create the event" });
  }
};

export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = filterEventsSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) res.status(400).json({ error: "Invalid filter format" });

    const { category, location, title } = req.query;

    const filteredEvents = await getFilteredEventsService(
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

    const event = await getEventByIdService(id as string);

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

    const event = await updateEventByIdService(id as string, req.body);
    return res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: "Failed to update event" });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ error: "Event id is required" });

    const userId = req.headers["user-id"] as unknown as mongoose.Types.ObjectId; // Access the user ID from headers
    const userRole = req.headers["user-role"] as string; // Access the user role from headers

    const event = await deleteEventByIdService(id, userId, userRole);
    return res.status(200).json(event);
  } catch (error: any) {
    if (error.message === "Event not found") {
      res.status(404).json({ error: error.message });
    } else if (error.message === "Forbidden to delete the event") {
      res.status(403).json({ error: error.message });
    } else res.status(500).json({ error: "Failed to delete event" });
  }
};
