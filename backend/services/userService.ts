import User from "../models/User.js";
import {
  GetAllUsersResult,
  GetUserResult,
  SearchUsersResult,
} from "../types/service.js";
import { logger } from "../utils/logger.js";

export const getAllUsers = async (): Promise<GetAllUsersResult> => {
  try {
    const users = await User.find().select("_id email name role");
    logger.debug(`Fetched ${users.length} users`);
    return { success: true, data: users };
  } catch (error) {
    logger.error("Failed to fetch users", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch users";
    return { success: false, error: message, statusCode: 500 };
  }
};

export const searchUsers = async (
  query: string
): Promise<SearchUsersResult> => {
  try {
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }).select("_id email name role");
    logger.debug(`User search: ${query} returned ${users.length} results`);
    return { success: true, data: users };
  } catch (error) {
    logger.error("Failed to search users", error);
    const message =
      error instanceof Error ? error.message : "Failed to search users";
    return { success: false, error: message, statusCode: 500 };
  }
};

export const getUserById = async (id: string): Promise<GetUserResult> => {
  try {
    const user = await User.findById(id).select("_id email name role");
    if (!user) {
      logger.warn("User not found", { userId: id });
      return { success: false, error: "User not found", statusCode: 404 };
    }
    return { success: true, data: user ?? undefined };
  } catch (error) {
    logger.error("Failed to get user", error);
    const message =
      error instanceof Error ? error.message : "Failed to get user";
    return { success: false, error: message, statusCode: 500 };
  }
};
