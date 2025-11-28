import express, { Request, Response } from "express";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import * as investmentService from "../services/investmentService.js";
import {
  AdminUpdateInvestmentDto,
  CreateInvestmentDto,
  UpdateCurrentValueDto,
} from "../types/investment.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendError, sendSuccess } from "../utils/response.js";
import {
  currentValueValidation,
  investmentValidation,
  validate,
} from "../utils/validation.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const result = await investmentService.getAllInvestments();
    if (!result.success) {
      sendError(
        res,
        result.error || "Failed to fetch investments",
        result.statusCode || 500
      );
      return;
    }
    sendSuccess(res, result.data, 200);
  })
);

router.get(
  "/stats",
  authenticate,
  asyncHandler(async (_req: Request, res: Response): Promise<void> => {
    const result = await investmentService.getInvestmentStats();
    if (!result.success) {
      sendError(
        res,
        result.error || "Failed to fetch stats",
        result.statusCode || 500
      );
      return;
    }
    sendSuccess(res, result.data, 200);
  })
);

router.get(
  "/:id",
  authenticate,
  asyncHandler(
    async (req: Request<{ id: string }>, res: Response): Promise<void> => {
      const { id } = req.params;
      if (!id) {
        sendError(res, "Investment ID is required", 400);
        return;
      }
      const result = await investmentService.getInvestmentById(id);
      if (!result.success) {
        sendError(
          res,
          result.error || "Investment not found",
          result.statusCode || 404
        );
        return;
      }
      sendSuccess(res, result.data, 200);
    }
  )
);

router.post(
  "/",
  authenticate,
  requireAdmin,
  validate(investmentValidation),
  asyncHandler(
    async (
      req: Request<unknown, unknown, CreateInvestmentDto>,
      res: Response
    ): Promise<void> => {
      const result = await investmentService.createInvestment(req.body);
      if (!result.success) {
        sendError(
          res,
          result.error || "Failed to create investment",
          result.statusCode || 400
        );
        return;
      }
      sendSuccess(res, result.data, result.statusCode || 201);
    }
  )
);

router.put(
  "/:id",
  authenticate,
  requireAdmin,
  validate(investmentValidation),
  asyncHandler(
    async (
      req: Request<{ id: string }, unknown, AdminUpdateInvestmentDto>,
      res: Response
    ): Promise<void> => {
      const result = await investmentService.updateInvestment(
        req.params.id,
        req.body
      );
      if (!result.success) {
        sendError(
          res,
          result.error || "Failed to update investment",
          result.statusCode || 400
        );
        return;
      }
      sendSuccess(res, result.data, 200);
    }
  )
);

router.patch(
  "/:id/current-value",
  authenticate,
  requireAdmin,
  validate(currentValueValidation),
  asyncHandler(
    async (
      req: Request<{ id: string }, unknown, UpdateCurrentValueDto>,
      res: Response
    ): Promise<void> => {
      const result = await investmentService.updateCurrentValue(
        req.params.id,
        req.body
      );
      if (!result.success) {
        sendError(
          res,
          result.error || "Failed to update current value",
          result.statusCode || 400
        );
        return;
      }
      sendSuccess(res, result.data, 200);
    }
  )
);

router.delete(
  "/:id",
  authenticate,
  requireAdmin,
  asyncHandler(
    async (req: Request<{ id: string }>, res: Response): Promise<void> => {
      const result = await investmentService.deleteInvestment(req.params.id);
      if (!result.success) {
        sendError(
          res,
          result.error || "Investment not found",
          result.statusCode || 404
        );
        return;
      }
      sendSuccess(res, result.data, 200);
    }
  )
);

export default router;
