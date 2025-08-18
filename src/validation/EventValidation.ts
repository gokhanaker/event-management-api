import Joi from "joi";

export const createOrUpdateEventSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(1000).required(),
  date: Joi.date().greater("now").required(),
  location: Joi.string().min(3).max(200).required(),
  category: Joi.string().min(2).max(50).required(),
  maxAttendees: Joi.number().integer().min(1).max(1000).required(),
});

export const filterEventsSchema = Joi.object({
  category: Joi.string().optional(),
  location: Joi.string().optional(),
  title: Joi.string().optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
});
