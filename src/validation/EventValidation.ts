import Joi from "joi";

export const createEventSchema = Joi.object({
  title: Joi.string().required().min(3).max(100).messages({
    "string.empty": "Title is required",
    "string.min": "Title must be at least 3 characters",
    "string.max": "Title cannot exceed 100 characters",
  }),
  description: Joi.string().required().max(500).messages({
    "string.empty": "Description is required",
    "string.max": "Description cannot exceed 500 characters",
  }),
  date: Joi.date().iso().required().messages({
    "date.base": "Invalid date format",
    "any.required": "Date is required",
  }),
  category: Joi.string()
    .required()
    .valid("Technology", "Sport", "Art", "Entertainment", "Health", "Other"),
  location: Joi.string().required().min(3).max(100).messages({
    "string.empty": "Location is required",
    "string.min": "Location must be at least 3 characters",
    "string.max": "Location cannot exceed 200 characters",
  }),
  maxAttendees: Joi.number().integer().positive().required().messages({
    "number.base": "Max attendees must be a positive number",
    "any.required": "Max attendees is required",
  }),
});

export const filterEventsSchema = Joi.object({
  category: Joi.string()
    .optional()
    .valid("Technology", "Sport", "Art", "Entertainment", "Health", "Other"),
  location: Joi.string().optional().min(1).max(50),
  title: Joi.string().optional().min(1).max(100),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
});
