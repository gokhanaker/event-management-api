import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const registerUserService = async (
  password: string,
  username: string,
  email: string,
  role: string
): Promise<void> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    username,
    email,
    password: hashedPassword,
    role: role || "user",
  });

  await user.save();
};

export const generateTokenService = (
  id: mongoose.Types.ObjectId,
  role: string
): string => {
  return jwt.sign({ id: id, role: role }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
};
