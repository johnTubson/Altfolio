import mongoose from "mongoose";
import Investment from "../models/Investment.js";
import User from "../models/User.js";
import { getEnv } from "./validateEnv.js";

export const connectDB = async (): Promise<void> => {
  try {
    const env = getEnv();
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedUsers();
    await seedInvestments();
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Database connection error:", errorMessage);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Database disconnection error:", errorMessage);
  }
};

const seedUsers = async (): Promise<void> => {
  const adminExists = await User.findOne({ email: "admin@altfolio.com" });
  if (!adminExists) {
    await User.create({
      email: "admin@altfolio.com",
      password: "admin123",
      role: "admin",
      name: "Admin User",
    });
    console.log("Admin user created: admin@altfolio.com / admin123");
  }

  const viewerExists = await User.findOne({ email: "viewer@altfolio.com" });
  if (!viewerExists) {
    await User.create({
      email: "viewer@altfolio.com",
      password: "viewer123",
      role: "viewer",
      name: "Viewer User",
    });
    console.log("Viewer user created: viewer@altfolio.com / viewer123");
  }
};

const seedInvestments = async (): Promise<void> => {
  const adminUser = await User.findOne({ email: "admin@altfolio.com" });
  if (!adminUser) {
    return;
  }
  const existingInvestments = await Investment.findOne({
    owners: adminUser._id,
  });
  if (existingInvestments) {
    return;
  }
  const now = new Date();
  const investments = [
    {
      assetName: "TechStart Inc.",
      assetType: "Startup" as const,
      investedAmount: 50000,
      investmentDate: new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000),
      currentValue: 67500,
      owners: [adminUser._id],
    },
    {
      assetName: "Bitcoin Fund Alpha",
      assetType: "Crypto Fund" as const,
      investedAmount: 100000,
      investmentDate: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000),
      currentValue: 142000,
      owners: [adminUser._id],
    },
    {
      assetName: "Midwest Farmland Portfolio",
      assetType: "Farmland" as const,
      investedAmount: 250000,
      investmentDate: new Date(now.getTime() - 730 * 24 * 60 * 60 * 1000),
      currentValue: 275000,
      owners: [adminUser._id],
    },
    {
      assetName: "Rare Art Collection",
      assetType: "Collectible" as const,
      investedAmount: 75000,
      investmentDate: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
      currentValue: 82000,
      owners: [adminUser._id],
    },
    {
      assetName: "Private Equity Fund",
      assetType: "Other" as const,
      investedAmount: 200000,
      investmentDate: new Date(now.getTime() - 545 * 24 * 60 * 60 * 1000),
      currentValue: 235000,
      owners: [adminUser._id],
    },
  ];
  await Investment.insertMany(investments);
  console.log(`Seeded ${investments.length} investments for admin user`);
};
