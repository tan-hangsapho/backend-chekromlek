import mongoose, { Document, Model } from "mongoose";

export interface AuthUser {
  username: string;
  email: string;
  password: string;
  googleId?: string;
  isVerified?: boolean;
  createdAt?: Date;
  updateAt?: Date;
}
export interface AuthUserDocument extends Document {
  username: string;
  email: string;
  password: string;
  googleId?: string;
  isVerified?: boolean;
  createdAt?: Date;
  updateAt?: Date;
}
const userAuthSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        delete ret.googleId;
        delete ret.__v;
      },
    },
  }
);

const AuthUserModel = mongoose.model<AuthUserDocument, AuthUser>(
  "AuthUser",
  userAuthSchema
);
export default AuthUserModel;
