import { Request, Response } from "express";
import { registerUserSchema } from "../validation/AuthValidation";
import { loginService, registerUserService } from "../service/AuthService";

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

    await registerUserService(password, username, email, role);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error: any) {
    if (error.message === "Email already in use") {
      res
        .status(400)
        .json({ error: "User with this email address already exists" });
    } else res.status(500).json({ error: "Failed to register user" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    const token = await loginService(email, password);
    res.status(200).json({ token, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: "Failed to login user" });
  }
};
