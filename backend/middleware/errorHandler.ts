import { NextFunction, Request, Response } from "express";
import { Error as MongooseError } from "mongoose";
import { getEnv } from "../config/validateEnv.js";
import { AppError, ValidationError } from "../types/error.js";
import { logger } from "../utils/logger.js";

export const errorHandler = (
  err: AppError | MongooseError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const env = getEnv();

  if (err.name === "ValidationError") {
    const validationError = err as ValidationError;
    const errors = Object.values(validationError.errors).map((e) => e.message);
    logger.warn("Validation error", { errors });
    res
      .status(400)
      .json({ success: false, error: "Validation error", details: errors });
    return;
  }

  if (err.name === "CastError") {
    logger.warn("Invalid ID format", { error: err.message });
    res.status(400).json({ success: false, error: "Invalid ID format" });
    return;
  }

  if ("code" in err && err.code === 11000) {
    const duplicateError = err as AppError & {
      keyPattern: Record<string, unknown>;
    };
    const field = duplicateError.keyPattern
      ? Object.keys(duplicateError.keyPattern)[0]
      : undefined;
    logger.warn("Duplicate entry", { field });
    res.status(400).json({ success: false, error: "Duplicate entry", field });
    return;
  }

  const status = ("status" in err && err.status) || 500;
  const message = err.message || "Internal server error";

  if (status >= 500) {
    logger.error("Server error", err);
  } else {
    logger.warn("Client error", { status, message });
  }

  res.status(status).json({
    success: false,
    error: message,
    ...(env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
