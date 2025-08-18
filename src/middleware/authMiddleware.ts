import { AuthenticationError, AuthorizationError } from "@/utils/errorHandler";
import { AuthenticatedRequest } from "@/types/express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { config } from "@/config/env";

export const authenticateJWT = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AuthenticationError("Access token is required");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new AuthenticationError("Access token is required");
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as any;
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new AuthenticationError("Token has expired");
    }
    throw new AuthenticationError("Invalid token");
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    if (!req.user) {
      throw new AuthenticationError("User not authenticated");
    }

    if (!roles.includes(req.user.role)) {
      throw new AuthorizationError(
        `Role ${req.user.role} is not authorized to access this resource`,
      );
    }

    next();
  };
};
