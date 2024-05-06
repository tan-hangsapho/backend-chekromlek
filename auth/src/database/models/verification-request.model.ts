import mongoose from "mongoose";
import CustomError from "../../errors/custom-erorrs";
import { StatusCode } from "../../utils/consts";

export interface IVerification {
  userId: mongoose.Types.ObjectId;
  token: string;
  expiredDate: Date;
  createdAt: Date;
}

const VerificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  token: {
    type: String,
    required: true,
    validate: (value: string): boolean => {
      if (!value) {
        throw new CustomError(
          "Invalid email verification token",
          StatusCode.Forbidden
        );
      }
      return true;
    },
  },
  expiredDate: {
    type: Date,
    default: new Date(Date.now() + 24 * 60 * 60 * 1000),
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(Date.now() + 24 * 60 * 60 * 1000),
  },
});

const VerificationModel = mongoose.model<IVerification>(
  "Verification",
  VerificationSchema
);
export default VerificationModel;
