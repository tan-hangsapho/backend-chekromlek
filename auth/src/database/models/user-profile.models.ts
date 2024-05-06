import mongoose, { Document, ObjectId } from "mongoose";

export interface IUser {
  username: string;
  email: string;
  profile?: string;
  favorites?: ObjectId[]; // Array ;
  questions?: ObjectId[]; // Array ;
  bio?: string;
  work?: string;
  contact?: string;
  socialLink?: { platform: string; url: string }[];
  location?: string;
  createdAt?: Date;
  answers?: number;
}

export interface IUserDocument extends Document {
  username: string;
  email: string;
  profile?: string;
  favorites?: ObjectId[];
  questions?: ObjectId[];
  bio?: string;
  work?: string;
  contact?: string;
  socialLink?: { platform: string; url: string }[];
  location?: string;
  createdAt?: Date;
  answers?: number;
}

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    profile: { type: String },
    favorites: [{ type: mongoose.Schema.Types.ObjectId }],
    questions: [{ type: mongoose.Schema.Types.ObjectId }],
    bio: { type: String },
    work: { type: String },
    contact: { type: String },
    socialLink: { type: [{ platform: String, url: String }] },
    location: { type: String },
    createdAt: { type: Date, default: Date.now },
    answers: { type: Number, default: 0 },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        delete ret.__v;
      },
    },
  }
);

const UserModel = mongoose.model<IUserDocument, IUser>("User", userSchema);

export default UserModel;
