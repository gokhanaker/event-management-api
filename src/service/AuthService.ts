import { ConflictError, AuthenticationError } from "../utils/errorHandler";
import { ERRORS } from "../constants/errors";
import { config } from "../config/env";
import User from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const registerUserService = async (
  password: string,
  username: string,
  email: string,
  role: string,
): Promise<string> => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ConflictError(ERRORS.USER_ALREADY_EXISTS);
  }

  const hashedPassword: string = await bcrypt.hash(password, 10);
  const user = new User({
    username,
    email,
    password: hashedPassword,
    role: role || "user",
  });

  await user.save();

  // Generate JWT token for the newly registered user
  const token: string = jwt.sign(
    { id: user._id, role: user.role },
    config.JWT_SECRET,
    {
      expiresIn: config.JWT_EXPIRATION_DURATION,
    },
  );

  return token;
};

export const loginService = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AuthenticationError(ERRORS.INVALID_CREDENTIALS);
  }

  const isMatch: boolean = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AuthenticationError(ERRORS.INVALID_PASSWORD);
  }

  const token: string = jwt.sign(
    { id: user._id, role: user.role },
    config.JWT_SECRET,
    {
      expiresIn: config.JWT_EXPIRATION_DURATION,
    },
  );

  return token;
};
