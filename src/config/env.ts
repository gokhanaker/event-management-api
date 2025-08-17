import dotenv from "dotenv";

dotenv.config();

interface EnvironmentConfig {
  NODE_ENV: string;
  PORT: number;
  MONGO_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRATION_DURATION: string;
  CORS_ORIGIN?: string;
}

const validateEnvironment = (): EnvironmentConfig => {
  const requiredEnvVars = [
    "MONGO_URI",
    "JWT_SECRET",
    "JWT_EXPIRATION_DURATION",
  ];

  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName],
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`,
    );
  }

  return {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: parseInt(process.env.PORT || "6000", 10),
    MONGO_URI: process.env.MONGO_URI!,
    JWT_SECRET: process.env.JWT_SECRET!,
    JWT_EXPIRATION_DURATION: process.env.JWT_EXPIRATION_DURATION!,
    CORS_ORIGIN: process.env.CORS_ORIGIN,
  };
};

export const config = validateEnvironment();
