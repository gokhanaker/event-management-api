import { formatErrorResponse } from "../utils/errorHandler";
import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const errorResponse = formatErrorResponse(error);

  // Log error for debugging (in development)
  if (process.env.NODE_ENV === "development") {
    console.error("Error:", {
      message: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query,
    });
  }

  res.status(errorResponse.statusCode).json(errorResponse);
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
