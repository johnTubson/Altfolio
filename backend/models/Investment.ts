import mongoose, { Model, Schema } from "mongoose";
import { AssetType, IInvestment } from "../types/investment.js";

export const ASSET_TYPES: readonly AssetType[] = [
  "Startup",
  "Crypto Fund",
  "Farmland",
  "Collectible",
  "Other",
] as const;

const investmentSchema = new Schema<IInvestment>(
  {
    assetName: {
      type: String,
      required: [true, "Asset name is required"],
      trim: true,
      maxlength: [200, "Asset name cannot exceed 200 characters"],
    },
    assetType: {
      type: String,
      required: [true, "Asset type is required"],
      enum: {
        values: ASSET_TYPES,
        message: `Asset type must be one of: ${ASSET_TYPES.join(", ")}`,
      },
    },
    investedAmount: {
      type: Number,
      required: [true, "Invested amount is required"],
      min: [0, "Invested amount cannot be negative"],
    },
    investmentDate: {
      type: Date,
      required: [true, "Investment date is required"],
      validate: {
        validator: function (this: IInvestment, date: Date): boolean {
          return date <= new Date();
        },
        message: "Investment date cannot be in the future",
      },
    },
    currentValue: {
      type: Number,
      required: [true, "Current value is required"],
      min: [0, "Current value cannot be negative"],
    },
    owners: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

investmentSchema.virtual("returnOnInvestment").get(function (): number {
  if (!this.investedAmount || this.investedAmount === 0) return 0;
  return (
    ((this.currentValue - this.investedAmount) / this.investedAmount) * 100
  );
});

investmentSchema.virtual("profitLoss").get(function (): number {
  return this.currentValue - this.investedAmount;
});

investmentSchema.set("toJSON", { virtuals: true });
investmentSchema.set("toObject", { virtuals: true });

const Investment: Model<IInvestment> = mongoose.model<IInvestment>(
  "Investment",
  investmentSchema
);

export default Investment;
