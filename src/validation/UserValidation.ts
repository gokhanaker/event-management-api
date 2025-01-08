import Joi from "joi";

export const registerUserSchema = Joi.object({
  username: Joi.string(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("user", "organizer", "admin").required(),
});
