import { AuthenticationError, AuthorizationError } from "../utils/errorHandler";
import { AuthenticatedRequest } from "../types/express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { config } from "../config/env";

interface DecodedToken {
  id: string;
  role: string;
}

export const authenticateJWT = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new AuthenticationError("No token provided");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as DecodedToken;

    // Attach user information to the request object
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      throw new AuthenticationError("Token is expired");
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
      throw new AuthorizationError("Insufficient permissions");
    }

    next();
  };
};
