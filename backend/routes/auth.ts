import express, { Request, Response } from "express";
import * as authService from "../services/authService.js";
import { LoginRequest } from "../types/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { loginValidation, validate } from "../utils/validation.js";

const router = express.Router();

router.post(
  "/login",
  validate(loginValidation),
  asyncHandler(
    async (
      req: Request<unknown, unknown, LoginRequest>,
      res: Response
    ): Promise<void> => {
      const { email, password } = req.body;
      const result = await authService.authenticateUser(email, password);
      if (!result.success) {
        sendError(
          res,
          result.error || "Authentication failed",
          result.statusCode || 401
        );
        return;
      }
      sendSuccess(res, result.data, 200);
    }
  )
);

router.get(
  "/me",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      sendError(res, "Authentication required", 401);
      return;
    }
    const result = await authService.getUserFromToken(token);
    if (!result.success) {
      sendError(res, result.error || "Invalid token", result.statusCode || 401);
      return;
    }
    sendSuccess(res, result.data, 200);
  })
);

export default router;
