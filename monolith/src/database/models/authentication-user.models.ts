import mongoose from "mongoose";
import { userAuthTypes } from "./@Types/userAuth.interface";

const userAuthSchema = new mongoose.Schema<userAuthTypes>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updateAt: {
    type: Date,
    default: new Date()
  }
});

export const UserAuth = mongoose.model<userAuthTypes>('UserAuth', userAuthSchema);