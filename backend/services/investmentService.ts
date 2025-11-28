import Investment from "../models/Investment.js";
import User from "../models/User.js";
import {
  AdminUpdateInvestmentDto,
  CreateInvestmentDto,
  IInvestment,
  InvestmentStats,
  UpdateCurrentValueDto,
} from "../types/investment.js";
import {
  CreateInvestmentResult,
  DeleteInvestmentResult,
  GetAllInvestmentsResult,
  GetInvestmentResult,
  GetInvestmentStatsResult,
  UpdateCurrentValueResult,
  UpdateInvestmentResult,
} from "../types/service.js";
import { logger } from "../utils/logger.js";

export const getAllInvestments = async (): Promise<GetAllInvestmentsResult> => {
  try {
    const investments = await Investment.find()
      .populate("owners", "name email")
      .sort({ investmentDate: -1 });
    logger.debug(`Fetched ${investments.length} investments`);
    return { success: true, data: investments };
  } catch (error) {
    logger.error("Failed to fetch investments", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch investments";
    return { success: false, error: message, statusCode: 500 };
  }
};

export const getInvestmentById = async (
  id: string
): Promise<GetInvestmentResult> => {
  try {
    const investment = await Investment.findById(id).populate(
      "owners",
      "name email"
    );
    if (!investment) {
      return { success: false, error: "Investment not found", statusCode: 404 };
    }
    return { success: true, data: investment };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch investment";
    return { success: false, error: message, statusCode: 500 };
  }
};

export const validateOwnerIds = async (
  ownerIds: string[]
): Promise<{ valid: boolean; error?: string }> => {
  try {
    const validOwners = await User.find({ _id: { $in: ownerIds } });
    if (validOwners.length !== ownerIds.length) {
      return { valid: false, error: "One or more owner IDs are invalid" };
    }
    return { valid: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to validate owners";
    return { valid: false, error: message };
  }
};

export const createInvestment = async (
  dto: CreateInvestmentDto
): Promise<CreateInvestmentResult> => {
  try {
    const ownerValidation = await validateOwnerIds(dto.owners);
    if (!ownerValidation.valid) {
      logger.warn("Investment creation failed: invalid owners", {
        owners: dto.owners,
      });
      return {
        success: false,
        error: ownerValidation.error || "Invalid owners",
        statusCode: 400,
      };
    }

    const investedAmount = parseFloat(dto.investedAmount.toString());

    const investment = await Investment.create({
      assetName: dto.assetName,
      assetType: dto.assetType,
      investedAmount: investedAmount,
      investmentDate: new Date(),
      currentValue: investedAmount,
      owners: dto.owners,
    });

    await investment.populate("owners", "name email");
    logger.info("Investment created", {
      investmentId: investment._id.toString(),
      assetName: dto.assetName,
    });
    return { success: true, data: investment, statusCode: 201 };
  } catch (error) {
    logger.error("Failed to create investment", error);
    const message =
      error instanceof Error ? error.message : "Failed to create investment";
    return { success: false, error: message, statusCode: 500 };
  }
};

export const updateInvestment = async (
  id: string,
  dto: AdminUpdateInvestmentDto
): Promise<UpdateInvestmentResult> => {
  try {
    const ownerValidation = await validateOwnerIds(dto.owners);
    if (!ownerValidation.valid) {
      logger.warn("Investment update failed: invalid owners", {
        investmentId: id,
        owners: dto.owners,
      });
      return {
        success: false,
        error: ownerValidation.error || "Invalid owners",
        statusCode: 400,
      };
    }

    const investment = await Investment.findByIdAndUpdate(
      id,
      {
        assetName: dto.assetName,
        assetType: dto.assetType,
        investedAmount: parseFloat(dto.investedAmount.toString()),
        investmentDate: new Date(dto.investmentDate),
        currentValue: parseFloat(dto.currentValue.toString()),
        owners: dto.owners,
      },
      { new: true, runValidators: true }
    ).populate("owners", "name email");

    if (!investment) {
      logger.warn("Investment update failed: not found", { investmentId: id });
      return { success: false, error: "Investment not found", statusCode: 404 };
    }

    logger.info("Investment updated", { investmentId: id });
    return { success: true, data: investment };
  } catch (error) {
    logger.error("Failed to update investment", error);
    const message =
      error instanceof Error ? error.message : "Failed to update investment";
    return { success: false, error: message, statusCode: 500 };
  }
};

export const updateCurrentValue = async (
  id: string,
  dto: UpdateCurrentValueDto
): Promise<UpdateCurrentValueResult> => {
  try {
    const investment = await Investment.findByIdAndUpdate(
      id,
      {
        currentValue: parseFloat(dto.currentValue.toString()),
      },
      { new: true, runValidators: true }
    ).populate("owners", "name email");

    if (!investment) {
      return { success: false, error: "Investment not found", statusCode: 404 };
    }

    return { success: true, data: investment };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update current value";
    return { success: false, error: message, statusCode: 500 };
  }
};

export const deleteInvestment = async (
  id: string
): Promise<DeleteInvestmentResult> => {
  try {
    const investment = await Investment.findByIdAndDelete(id);
    if (!investment) {
      logger.warn("Investment deletion failed: not found", {
        investmentId: id,
      });
      return { success: false, error: "Investment not found", statusCode: 404 };
    }
    logger.info("Investment deleted", { investmentId: id });
    return {
      success: true,
      data: { message: "Investment deleted successfully" },
    };
  } catch (error) {
    logger.error("Failed to delete investment", error);
    const message =
      error instanceof Error ? error.message : "Failed to delete investment";
    return { success: false, error: message, statusCode: 500 };
  }
};

const calculateTotalInvested = (investments: IInvestment[]): number => {
  return investments.reduce((sum, inv) => sum + inv.investedAmount, 0);
};

const calculateTotalCurrent = (investments: IInvestment[]): number => {
  return investments.reduce((sum, inv) => sum + inv.currentValue, 0);
};

const calculateTotalROI = (
  totalInvested: number,
  totalCurrent: number
): number => {
  return totalInvested > 0
    ? ((totalCurrent - totalInvested) / totalInvested) * 100
    : 0;
};

const calculateTotalProfitLoss = (
  totalInvested: number,
  totalCurrent: number
): number => {
  return totalCurrent - totalInvested;
};

const calculateStatsByType = (
  investments: IInvestment[]
): InvestmentStats["byType"] => {
  return investments.reduce((acc, inv) => {
    const type = inv.assetType;
    if (!acc[type]) {
      acc[type] = { count: 0, invested: 0, current: 0 };
    }
    acc[type].count++;
    acc[type].invested += inv.investedAmount;
    acc[type].current += inv.currentValue;
    return acc;
  }, {} as InvestmentStats["byType"]);
};

export const getInvestmentStats =
  async (): Promise<GetInvestmentStatsResult> => {
    try {
      const investments = await Investment.find().populate(
        "owners",
        "name email"
      );

      const totalInvested = calculateTotalInvested(investments);
      const totalCurrent = calculateTotalCurrent(investments);
      const totalROI = calculateTotalROI(totalInvested, totalCurrent);
      const totalProfitLoss = calculateTotalProfitLoss(
        totalInvested,
        totalCurrent
      );

      const stats = {
        summary: {
          totalInvested,
          totalCurrent,
          totalROI: parseFloat(totalROI.toFixed(2)),
          totalProfitLoss: parseFloat(totalProfitLoss.toFixed(2)),
          totalCount: investments.length,
        },
        byType: calculateStatsByType(investments),
      };

      return { success: true, data: stats };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to calculate stats";
      return { success: false, error: message, statusCode: 500 };
    }
  };
