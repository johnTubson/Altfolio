import bcrypt from "bcryptjs";
import mongoose, { CallbackError, Model, Schema } from "mongoose";
import { IUser } from "../types/express.js";

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "viewer"],
      default: "viewer",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre<IUser>(
  "save",
  async function (
    this: IUser,
    next: (err?: CallbackError) => void
  ): Promise<void> {
    if (!this.isModified("password")) {
      next();
      return;
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
  }
);

userSchema.methods.comparePassword = async function (
  this: IUser,
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
