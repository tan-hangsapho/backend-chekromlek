import mongoose from "mongoose";
import { userAuthTypes } from "./@Types/userAuth.interface";

const userAuthSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    isVerified: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: new Date(),
    },
    updatedAt: {
      type: Date,
      default: new Date(),
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        delete ret.googleId;
        delete ret.__v;
      },
    },
  }
);

export const UserAuthModel = mongoose.model<userAuthTypes>(
  "UserAuth",
  userAuthSchema
);
