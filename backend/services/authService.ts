import jwt from "jsonwebtoken";
import { getEnv } from "../config/validateEnv.js";
import User from "../models/User.js";
import { JwtPayload, LoginResponse } from "../types/auth.js";
import { ServiceResult } from "../types/service.js";
import { logger } from "../utils/logger.js";

const getJwtSecret = (): string => {
  const env = getEnv();
  return env.JWT_SECRET;
};

const generateToken = (userId: string, role: "admin" | "viewer"): string => {
  const secret = getJwtSecret();
  return jwt.sign({ userId, role }, secret, { expiresIn: "7d" });
};

const verifyToken = (token: string): JwtPayload => {
  const secret = getJwtSecret();
  return jwt.verify(token, secret) as JwtPayload;
};

export const authenticateUser = async (
  email: string,
  password: string
): Promise<ServiceResult<LoginResponse>> => {
  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      logger.warn("Authentication failed: user not found", { email });
      return {
        success: false,
        error: "Invalid credentials",
        statusCode: 401,
      };
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      logger.warn("Authentication failed: invalid password", { email });
      return {
        success: false,
        error: "Invalid credentials",
        statusCode: 401,
      };
    }

    const token = generateToken(user._id.toString(), user.role);
    const response: LoginResponse = {
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };

    logger.info("User authenticated successfully", {
      userId: user._id.toString(),
      email,
    });
    return { success: true, data: response };
  } catch (error) {
    logger.error("Authentication error", error);
    const message =
      error instanceof Error ? error.message : "Authentication failed";
    return { success: false, error: message, statusCode: 500 };
  }
};

export const getUserFromToken = async (
  token: string
): Promise<
  ServiceResult<{
    user: { id: string; email: string; name: string; role: "admin" | "viewer" };
  }>
> => {
  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      logger.warn("Token validation failed: user not found", {
        userId: decoded.userId,
      });
      return {
        success: false,
        error: "User not found",
        statusCode: 401,
      };
    }

    return {
      success: true,
      data: {
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    };
  } catch (error) {
    logger.warn("Token validation failed", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return {
      success: false,
      error: "Invalid or expired token",
      statusCode: 401,
    };
  }
};
