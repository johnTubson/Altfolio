import { Response } from "express";

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode: number = 200,
  message?: string
): void => {
  const response: ApiResponse<T> = { success: true, data };
  if (message) {
    response.message = message;
  }
  res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  error: string,
  statusCode: number = 500
): void => {
  res.status(statusCode).json({ success: false, error });
};
