import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export interface CreateEventRequest extends AuthenticatedRequest {
  body: {
    title: string;
    description: string;
    date: string;
    location: string;
    category:
      | "Technology"
      | "Sport"
      | "Art"
      | "Entertainment"
      | "Health"
      | "Other";
    maxAttendees: number;
  };
}

export interface UpdateEventRequest extends AuthenticatedRequest {
  params: {
    id: string;
  };
  body: Partial<{
    title: string;
    description: string;
    date: string;
    location: string;
    category:
      | "Technology"
      | "Sport"
      | "Art"
      | "Entertainment"
      | "Health"
      | "Other";
    maxAttendees: number;
  }>;
}

export interface RegisterUserRequest extends Request {
  body: {
    username: string;
    email: string;
    password: string;
    role: "user" | "organizer" | "admin";
  };
}

export interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
