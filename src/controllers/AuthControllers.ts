import { loginService, registerUserService } from "../service/AuthService";
import { RegisterUserRequest, LoginRequest } from "../types/express";
import { registerUserSchema } from "../validation/AuthValidation";
import { successResponse } from "../utils/responseHandler";
import { asyncHandler } from "../middleware/errorHandler";
import { ValidationError } from "../utils/errorHandler";
import { Response } from "express";

export const registerUser = asyncHandler(
  async (req: RegisterUserRequest, res: Response) => {
    const { error } = registerUserSchema.validate(req.body, {
      abortEarly: false,
    });

    if (error) {
      throw new ValidationError(
        error.details.map((detail) => detail.message).join(", "),
      );
    }

    const { username, email, password, role } = req.body;

    await registerUserService(password, username, email, role);
    successResponse(res, null, "User registered successfully", 201);
  },
);

export const login = asyncHandler(async (req: LoginRequest, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ValidationError("Email and password are required");
  }

  const token = await loginService(email, password);
  successResponse(res, { token }, "Login successful");
});
