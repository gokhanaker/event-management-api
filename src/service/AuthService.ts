import { ConflictError, AuthenticationError } from "@/utils/errorHandler";
import { ERRORS } from "@/constants/errors";
import { config } from "@/config/env";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const registerUserService = async (
  password: string,
  username: string,
  email: string,
  role: string,
): Promise<string> => {
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new ConflictError("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    email,
    password: hashedPassword,
    role,
  });

  await user.save();
  const token: string = jwt.sign(
    { id: user._id, role: user.role },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRATION_DURATION },
  );
  return token;
};

export const loginService = async (email: string, password: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AuthenticationError(ERRORS.INVALID_CREDENTIALS);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AuthenticationError(ERRORS.INVALID_CREDENTIALS);
  }

  const token: string = jwt.sign(
    { id: user._id, role: user.role },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRATION_DURATION },
  );

  return token;
};
