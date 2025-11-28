import express, { Request, Response } from "express";
import { authenticate } from "../middleware/auth.js";
import * as userService from "../services/userService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendError, sendSuccess } from "../utils/response.js";
import {
  searchQueryValidation,
  userIdValidation,
  validate,
} from "../utils/validation.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const result = await userService.getAllUsers();
    if (!result.success) {
      sendError(
        res,
        result.error || "Failed to fetch users",
        result.statusCode || 500
      );
      return;
    }
    sendSuccess(res, result.data, 200);
  })
);

router.get(
  "/search",
  authenticate,
  validate(searchQueryValidation),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await userService.searchUsers(req.query.q as string);
    if (!result.success) {
      sendError(
        res,
        result.error || "Failed to search users",
        result.statusCode || 500
      );
      return;
    }
    sendSuccess(res, result.data, 200);
  })
);

router.get(
  "/:id",
  validate(userIdValidation),
  authenticate,
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    if (!id) {
      sendError(res, "User ID is required", 400);
      return;
    }
    const result = await userService.getUserById(id);
    if (!result.success) {
      sendError(
        res,
        result.error || "User not found",
        result.statusCode || 500
      );
      return;
    }
    sendSuccess(res, result.data, 200);
  })
);

export default router;
