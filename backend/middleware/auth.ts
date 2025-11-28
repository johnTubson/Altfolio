import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getEnv } from "../config/validateEnv.js";
import User from "../models/User.js";
import { JwtPayload } from "../types/auth.js";
import { AuthenticatedRequest } from "../types/express.js";
import { logger } from "../utils/logger.js";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      logger.warn("Authentication failed: no token provided", {
        path: req.path,
      });
      res
        .status(401)
        .json({ success: false, error: "Authentication required" });
      return;
    }

    const env = getEnv();
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      logger.warn("Authentication failed: user not found", {
        userId: decoded.userId,
      });
      res.status(401).json({ success: false, error: "User not found" });
      return;
    }

    (req as AuthenticatedRequest).user = user;
    next();
  } catch (error) {
    logger.warn("Authentication failed: invalid token", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authReq = req as AuthenticatedRequest;
  if (authReq.user.role !== "admin") {
    logger.warn("Admin access denied", {
      userId: authReq.user._id.toString(),
      path: req.path,
    });
    res.status(403).json({ success: false, error: "Admin access required" });
    return;
  }
  next();
};
