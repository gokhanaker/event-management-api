import Joi from "joi";

export enum Role {
  User = "user",
  Organizer = "organizer",
  Admin = "admin",
}

export const registerUserSchema = Joi.object({
  username: Joi.string(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string()
    .valid(...Object.values(Role))
    .required(),
});
