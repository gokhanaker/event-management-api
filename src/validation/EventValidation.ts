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
  time: Joi.string()
    .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .required()
    .messages({
      "string.pattern.base": "Time must be in HH:mm format",
      "any.required": "Time is required",
    }),
  location: Joi.string().required().min(3).max(200).messages({
    "string.empty": "Location is required",
    "string.min": "Location must be at least 3 characters",
    "string.max": "Location cannot exceed 200 characters",
  }),
  maxAttendees: Joi.number().integer().positive().required().messages({
    "number.base": "Max attendees must be a positive number",
    "any.required": "Max attendees is required",
  }),
});
