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
import { successResponse } from "../utils/responseHandler";
import { asyncHandler } from "../middleware/errorHandler";
import { ValidationError } from "../utils/errorHandler";
import { AuthenticatedRequest } from "../types/express";
import logger from "../utils/logger";
import { Response } from "express";
import mongoose from "mongoose";

export const createEvent = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { error } = createOrUpdateEventSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      throw new ValidationError(
        error.details.map((detail) => detail.message).join(", "),
      );
    }

    if (!req.user) {
      throw new ValidationError("User not authenticated");
    }

    const userId = new mongoose.Types.ObjectId(req.user.id);
    const userRole = req.user.role;

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

    logger.info(`Event created successfully: ${title} by user ${req.user.id}`);
    successResponse(res, event, "Event created successfully", 201);
  },
);

export const getEvents = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { error } = filterEventsSchema.validate(req.params, {
      abortEarly: false,
    });

    if (error) {
      throw new ValidationError("Invalid filter format");
    }

    const { category, location, title, startDate, endDate } = req.query;

    const filteredEvents = await getFilteredEventsService(
      category as string,
      location as string,
      title as string,
      startDate as string,
      endDate as string,
    );

    logger.info(
      `Events retrieved successfully: ${filteredEvents.length} events found`,
    );
    successResponse(
      res,
      { events: filteredEvents },
      "Events retrieved successfully",
    );
  },
);

export const getEvent = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    if (!id) {
      throw new ValidationError("Event ID is required");
    }

    const event = await getEventByIdService(id as string);

    logger.info(`Event retrieved successfully: ${id}`);
    successResponse(res, event, "Event retrieved successfully");
  },
);

export const updateEvent = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { error } = createOrUpdateEventSchema.validate(req.body, {
      abortEarly: false,
    });

    if (!id || error) {
      throw new ValidationError(
        error
          ? error.details.map((detail) => detail.message).join(", ")
          : "Event ID is required",
      );
    }

    if (!req.user) {
      throw new ValidationError("User not authenticated");
    }

    const userId = new mongoose.Types.ObjectId(req.user.id);
    const userRole = req.user.role;

    const event = await updateEventByIdService(
      id as string,
      req.body,
      userId,
      userRole,
    );

    logger.info(`Event updated successfully: ${id} by user ${req.user.id}`);
    successResponse(res, event, "Event updated successfully");
  },
);

export const deleteEvent = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    if (!id) {
      throw new ValidationError("Event ID is required");
    }

    if (!req.user) {
      throw new ValidationError("User not authenticated");
    }

    const userId = new mongoose.Types.ObjectId(req.user.id);
    const userRole = req.user.role;

    const event = await deleteEventByIdService(id, userId, userRole);

    logger.info(`Event deleted successfully: ${id} by user ${req.user.id}`);
    successResponse(res, event, "Event deleted successfully");
  },
);
