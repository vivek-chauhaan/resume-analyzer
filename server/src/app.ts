import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env";
import authRoutes from "./routes/auth.routes";
import resumeRoutes from "./routes/resume.routes";
import analysisRoutes from "./routes/analysis.routes";
import { notFoundHandler, errorHandler } from "./middleware/error.middleware";

export function createApp(): Application {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.clientUrl, credentials: true }));
  app.use(morgan(env.nodeEnv === "development" ? "dev" : "combined"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/api/health", (_req, res) => {
    res.status(200).json({ success: true, data: { status: "ok" }, message: "Server is healthy" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/resume", resumeRoutes);
  app.use("/api/analysis", analysisRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
