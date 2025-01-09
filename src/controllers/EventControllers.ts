import {
  getEventByIdService,
  createNewEventService,
  getFilteredEventsService,
  deleteEventByIdService,
  updateEventByIdService,
} from "../service/EventService";
import {
  createOrUpdateEventSchema,
  filterEventsSchema,
} from "../validation/EventValidation";
import { Request, Response } from "express";
import mongoose from "mongoose";

export const createEvent = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { error } = createOrUpdateEventSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      return res.status(400).json({ error: "Invalid event format" });
    }

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
      maxAttendees,
    );

    return res.status(201).json(event);
  } catch (error: any) {
    if (error.message === "User role is not valid to create a new event") {
      return res.status(403).json({ error: error.message });
    }
    return res.status(500).json({ error: "Failed to create the event" });
  }
};

export const getEvents = async (req: Request, res: Response): Promise<any> => {
  try {
    const { error } = filterEventsSchema.validate(req.params, {
      abortEarly: false,
    });

    if (error) return res.status(400).json({ error: "Invalid filter format" });

    const { category, location, title, startDate, endDate } = req.query;

    const filteredEvents = await getFilteredEventsService(
      category as string,
      location as string,
      title as string,
      startDate as string,
      endDate as string,
    );

    return res.status(200).json({ events: filteredEvents });
  } catch (error) {
    return res.status(500).json({ error: "Failed to retrieve events" });
  }
};

export const getEvent = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Event id is required" });

    const event = await getEventByIdService(id as string);

    return res.status(200).json(event);
  } catch (error) {
    return res.status(500).json({ error: "Failed to retrieve event" });
  }
};

export const updateEvent = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "Event id is required" });

    const { error } = createOrUpdateEventSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) return res.status(400).json({ error: "Invalid event format" });

    const userId = req.headers["user-id"] as unknown as mongoose.Types.ObjectId;
    const userRole = req.headers["user-role"] as string;

    const event = await updateEventByIdService(
      id as string,
      req.body,
      userId,
      userRole,
    );
    return res.status(200).json(event);
  } catch (error: any) {
    if (error.message === "Event not found") {
      return res.status(404).json({ error: error.message });
    } else if (error.message === "Forbidden to update the event") {
      return res.status(403).json({ error: error.message });
    }
    return res.status(500).json({ error: "Failed to update event" });
  }
};

export const deleteEvent = async (
  req: Request,
  res: Response,
): Promise<any> => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ error: "Event id is required" });

    const userId = req.headers["user-id"] as unknown as mongoose.Types.ObjectId; // Access the user ID from headers
    const userRole = req.headers["user-role"] as string; // Access the user role from headers

    const event = await deleteEventByIdService(id, userId, userRole);
    return res.status(200).json(event);
  } catch (error: any) {
    if (error.message === "Event not found") {
      return res.status(404).json({ error: error.message });
    } else if (error.message === "Forbidden to delete the event") {
      return res.status(403).json({ error: error.message });
    } else res.status(500).json({ error: "Failed to delete event" });
  }
};
