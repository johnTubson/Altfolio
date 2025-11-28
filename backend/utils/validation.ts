import { NextFunction, Request, Response } from "express";
import {
  body,
  param,
  query,
  Result,
  ValidationChain,
  validationResult,
} from "express-validator";

export const validate = (
  validations: ValidationChain[]
): ((req: Request, res: Response, next: NextFunction) => Promise<void>) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors: Result = validationResult(req);
    if (errors.isEmpty()) {
      next();
      return;
    }

    res.status(400).json({
      error: "Validation failed",
      details: errors.array(),
    });
  };
};

export const loginValidation: ValidationChain[] = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const investmentValidation: ValidationChain[] = [
  body("assetName")
    .trim()
    .notEmpty()
    .withMessage("Asset name is required")
    .isLength({ max: 200 })
    .withMessage("Asset name cannot exceed 200 characters"),
  body("assetType")
    .isIn(["Startup", "Crypto Fund", "Farmland", "Collectible", "Other"])
    .withMessage("Invalid asset type"),
  body("investedAmount")
    .isFloat({ min: 0 })
    .withMessage("Invested amount must be a positive number"),
  body("owners")
    .isArray({ min: 1 })
    .withMessage("At least one owner is required")
    .custom((owners: unknown[]): boolean => {
      if (
        !owners.every(
          (id): boolean =>
            typeof id === "string" && /^[0-9a-fA-F]{24}$/.test(id)
        )
      ) {
        throw new Error("All owner IDs must be valid MongoDB ObjectIds");
      }
      return true;
    }),
];

export const currentValueValidation: ValidationChain[] = [
  body("currentValue")
    .isFloat({ min: 0 })
    .withMessage("Current value must be a positive number"),
];

export const userIdValidation: ValidationChain[] = [
  param("id").notEmpty().withMessage("User ID is required"),
];

export const searchQueryValidation: ValidationChain[] = [
  query("q")
    .notEmpty()
    .withMessage("Search query is required")
    .trim()
    .escape()
    .withMessage("Search query cannot contain special characters"),
];
