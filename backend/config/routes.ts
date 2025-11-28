import { Router } from "express";
import authRoutes from "../routes/auth.js";
import investmentRoutes from "../routes/investments.js";
import userRoutes from "../routes/users.js";

export const registerRoutes = (app: Router): void => {
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/users", userRoutes);
  app.use("/api/v1/investments", investmentRoutes);
};
