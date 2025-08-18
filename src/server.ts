import { healthCheck } from "@/controllers/HealthController";
import attendanceRoutes from "@/routes/AttendanceRoutes";
import { errorHandler } from "@/middleware/errorHandler";
import logger, { logHTTPRequest } from "@/utils/logger";
import { rateLimiter } from "@/middleware/rateLimiter";
import eventRoutes from "@/routes/EventRoutes";
import authRoutes from "@/routes/AuthRoutes";
import { config } from "@/config/env";
import connectDB from "@/config/db";
import express from "express";
import helmet from "helmet";
import cors from "cors";

const app = express();

connectDB();

app.use(helmet());

app.use(
  cors({
    origin: config.CORS_ORIGIN || "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to log HTTP requests
app.use(logHTTPRequest);

// Middleware to rate limit requests
app.use(rateLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/attendance", attendanceRoutes);

// Health check endpoint
app.get("/health", healthCheck);

// Error handling middleware
app.use(errorHandler);

const gracefulShutdown = (signal: string) => {
  logger.info(`${signal} received. Starting shutdown...`);
  process.exit(0);
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

const server = app.listen(config.PORT, () => {
  logger.info(`🚀 Server running on port ${config.PORT}`);
  logger.info(`📊 Environment: ${config.NODE_ENV}`);
  logger.info(`🔗 Health check: http://localhost:${config.PORT}/health`);
});

process.on("unhandledRejection", (err: Error) => {
  logger.error("Unhandled Promise Rejection:", err);
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err: Error) => {
  logger.error("Uncaught Exception:", err);
  server.close(() => {
    process.exit(1);
  });
});
