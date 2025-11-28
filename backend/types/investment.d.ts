import { Document, Types } from "mongoose";

export type AssetType =
  | "Startup"
  | "Crypto Fund"
  | "Farmland"
  | "Collectible"
  | "Other";

export interface IOwner {
  _id: string;
  name: string;
  email: string;
}

export interface IInvestment extends Document {
  _id: string;
  assetName: string;
  assetType: AssetType;
  investedAmount: number;
  investmentDate: Date;
  currentValue: number;
  owners: Types.ObjectId[] | IOwner[];
  returnOnInvestment: number;
  profitLoss: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface InvestmentStats {
  summary: {
    totalInvested: number;
    totalCurrent: number;
    totalROI: number;
    totalProfitLoss: number;
    totalCount: number;
  };
  byType: Record<
    AssetType,
    {
      count: number;
      invested: number;
      current: number;
    }
  >;
}

export interface CreateInvestmentDto {
  assetName: string;
  assetType: AssetType;
  investedAmount: number;
  owners: string[];
}

export interface AdminUpdateInvestmentDto extends CreateInvestmentDto {
  currentValue: number;
  investmentDate: string;
}

export interface UpdateCurrentValueDto {
  currentValue: number;
}
