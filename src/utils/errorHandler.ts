export class AppError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Authentication failed") {
    super(message, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = "Access forbidden") {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found") {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Resource conflict") {
    super(message, 409);
  }
}

export const formatErrorResponse = (error: any) => {
  if (error instanceof AppError) {
    return {
      error: error.message,
      statusCode: error.statusCode,
      timestamp: new Date().toISOString(),
    };
  }

  // Handle Joi validation errors
  if (error.isJoi) {
    return {
      error: "Validation failed",
      details: error.details.map((detail: any) => detail.message),
      statusCode: 400,
      timestamp: new Date().toISOString(),
    };
  }

  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((err: any) => err.message);
    return {
      error: "Validation failed",
      details: messages,
      statusCode: 400,
      timestamp: new Date().toISOString(),
    };
  }

  // Default error response
  return {
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : error.message,
    statusCode: 500,
    timestamp: new Date().toISOString(),
  };
};
