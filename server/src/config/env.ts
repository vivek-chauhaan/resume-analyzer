import dotenv from "dotenv";

dotenv.config();

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  mongoUri: required("MONGO_URI"),
  jwtSecret: required("JWT_SECRET"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  maxUploadMb: Number(process.env.MAX_UPLOAD_MB) || 5,
  aiServiceUrl: process.env.AI_SERVICE_URL || "http://localhost:8001",
  aiServiceTimeoutMs: Number(process.env.AI_SERVICE_TIMEOUT_MS) || 3000,
};
