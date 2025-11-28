import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import helmet from "helmet";
import { connectDB, disconnectDB } from "./config/database.js";
import { registerRoutes } from "./config/routes.js";
import { validateEnv } from "./config/validateEnv.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { rateLimiter } from "./middleware/rateLimiter.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { logger } from "./utils/logger.js";

dotenv.config();

const env = validateEnv();
const app = express();

app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: env.CORS_ORIGIN || "*",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(requestLogger);
app.use(rateLimiter);

registerRoutes(app);

app.get("/api/health", (_req: Request, res: Response): void => {
  res.json({
    status: "ok",
    message: "Altfolio API is running",
    timestamp: new Date().toISOString(),
  });
});

app.use((_req: Request, res: Response): void => {
  res.status(404).json({ success: false, error: "Route not found" });
});

app.use(errorHandler);

let server: ReturnType<typeof app.listen> | null = null;

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    server = app.listen(env.PORT, (): void => {
      logger.info(`Server running on port ${env.PORT}`, {
        environment: env.NODE_ENV,
      });
    });
  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
};

const gracefulShutdown = async (signal: string): Promise<void> => {
  logger.info(`Received ${signal}, starting graceful shutdown`);
  if (server) {
    server.close(async () => {
      logger.info("HTTP server closed");
      await disconnectDB();
      process.exit(0);
    });
    setTimeout(() => {
      logger.error("Forced shutdown after timeout");
      process.exit(1);
    }, 10000);
  } else {
    await disconnectDB();
    process.exit(0);
  }
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("unhandledRejection", (reason: unknown) => {
  logger.error("Unhandled Promise Rejection", reason);
  process.exit(1);
});

process.on("uncaughtException", (error: Error) => {
  logger.error("Uncaught Exception", error);
  process.exit(1);
});

startServer();
