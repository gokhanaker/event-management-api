import { Request, Response } from "express";
import { registerUserSchema } from "../validation/UserValidation";
import User from "../models/User";
import bcrypt from "bcrypt";
import {
  generateTokenService,
  registerUserService,
} from "../service/AuthService";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { error } = registerUserSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      res
        .status(400)
        .json({ errors: error.details.map((detail) => detail.message) });
      return;
    }

    const { username, email, password, role } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      res.status(400).json({ error: "Email already in use" });
      return;
    }

    await registerUserService(password, username, email, role);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to register user" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: "Invalid password" });
    }

    const token = await generateTokenService(user._id, user.role);
    res.status(200).json({ token, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: "Failed to login user" });
  }
};
