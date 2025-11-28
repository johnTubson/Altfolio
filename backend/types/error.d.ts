import { Error as MongooseError } from "mongoose";

export interface AppError extends MongooseError {
  status?: number;
  code?: number;
  keyPattern?: Record<string, unknown>;
}

export interface ValidationError extends MongooseError.ValidationError {
  errors: Record<string, Error.ValidatorError | Error.CastError>;
}
