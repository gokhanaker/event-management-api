import Joi from "joi";

export const createEventSchema = Joi.object({
  title: Joi.string().required().min(3).max(100),
  description: Joi.string().required().max(500),
  date: Joi.date().iso().required(),
  category: Joi.string()
    .required()
    .valid("Technology", "Sport", "Art", "Entertainment", "Health", "Other"),
  location: Joi.string().required().min(3).max(100),
  maxAttendees: Joi.number().integer().positive().required(),
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
