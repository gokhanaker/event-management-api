import { loginService, registerUserService } from "../service/AuthService";
import { registerUserSchema } from "../validation/AuthValidation";
import { ERRORS } from "../constants/errors";
import { Request, Response } from "express";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { error } = registerUserSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      res.status(400).json({ errors: ERRORS.INVALID_PAYLOAD });
      return;
    }

    const { username, email, password, role } = req.body;

    await registerUserService(password, username, email, role);
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error: any) {
    if (error.message === ERRORS.USER_ALREADY_EXISTS) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(500).json({ error: "Failed to register user" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: ERRORS.INVALID_PAYLOAD });
    }

    const token = await loginService(email, password);
    return res.status(200).json({ token, message: "Login successful" });
  } catch (error: any) {
    if (error.message === ERRORS.INVALID_CREDENTIALS) {
      return res.status(401).json({ error: error.message });
    } else if (error.message === ERRORS.INVALID_PASSWORD) {
      return res.status(401).json({ error: error.message });
    }
    return res.status(500).json({ error: "Failed to login user" });
  }
};
