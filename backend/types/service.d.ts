import { IUser } from "./express.js";
import { IInvestment, InvestmentStats } from "./investment.js";

export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

export type GetAllInvestmentsResult = ServiceResult<IInvestment[]>;
export type GetInvestmentResult = ServiceResult<IInvestment>;
export type CreateInvestmentResult = ServiceResult<IInvestment>;
export type UpdateInvestmentResult = ServiceResult<IInvestment>;
export type UpdateCurrentValueResult = ServiceResult<IInvestment>;
export type DeleteInvestmentResult = ServiceResult<{ message: string }>;
export type GetInvestmentStatsResult = ServiceResult<InvestmentStats>;
export type GetAllUsersResult = ServiceResult<IUser[]>;
export type GetUserResult = ServiceResult<IUser>;
export type SearchUsersResult = ServiceResult<IUser[]>;
