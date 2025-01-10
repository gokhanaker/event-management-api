import { ERRORS } from "../constants/errors";
import User from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const registerUserService = async (
  password: string,
  username: string,
  email: string,
  role: string,
): Promise<void> => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error(ERRORS.USER_ALREADY_EXISTS);
  }

  const hashedPassword: string = await bcrypt.hash(password, 10);
  const user = new User({
    username,
    email,
    password: hashedPassword,
    role: role || "user",
  });

  await user.save();
};

export const loginService = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error(ERRORS.INVALID_CREDENTIALS);
  }

  const isMatch: boolean = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error(ERRORS.INVALID_PASSWORD);
  }

  const token: string = jwt.sign(
    { id: user._id, role: user.role }, // JWT includes user id and user role data fields
    process.env.JWT_SECRET as string,
    {
      expiresIn: process.env.JWT_EXPIRATION_DURATION,
    },
  );

  return token;
};
