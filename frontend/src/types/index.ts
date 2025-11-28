export type AssetType =
  | "Startup"
  | "Crypto Fund"
  | "Farmland"
  | "Collectible"
  | "Other";

export interface User {
  _id: string;
  id?: string;
  email: string;
  name: string;
  role: "admin" | "viewer";
}

export interface Owner {
  _id: string;
  name: string;
  email: string;
}

export interface Investment {
  _id: string;
  assetName: string;
  assetType: AssetType;
  investedAmount: number;
  investmentDate: string | Date;
  currentValue: number;
  owners: Owner[] | string[];
  returnOnInvestment?: number;
  profitLoss?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
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

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}
