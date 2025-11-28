import { Request } from "express";
import { Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  name: string;
  role: "admin" | "viewer";
  comparePassword(candidatePassword: string): Promise<boolean>;
  isModified(field: string): boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthenticatedRequest extends Request {
  user: IUser;
}
