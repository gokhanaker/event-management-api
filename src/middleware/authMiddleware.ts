import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";

interface DecodedToken {
  id: string;
  role: string;
}

interface User {
  id: string;
  role: string;
}

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    res.status(403).json({ error: "Access forbidden: No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as DecodedToken;

    // Attach user information to the request object for later use
    req.headers["user-id"] = decoded.id;
    req.headers["user-role"] = decoded.role;

    next(); // Token is valid, proceed to the next middleware or route handler
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      res.status(401).json({ error: "Access forbidden: Token is expired" });
      return;
    }

    res.status(403).json({ error: "Access forbidden: Invalid token" });
    return;
  }
};
