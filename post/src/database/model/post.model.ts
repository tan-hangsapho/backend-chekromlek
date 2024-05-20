import mongoose from "mongoose";

export interface IPost {
  _id?: string;
  title: string;
  descriptions?: string;
  userId?: string;
  likes?: number;
  answer?: string;
  image?: string;
  category: string;
  createdAt?: Date;
}

const postModel = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    descriptions: { type: String, required: true },
    image: { type: String },
    category: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    toJSON: {
      transform(_doc, ret) {
        delete ret.userId;
        delete ret.__v;
      },
    },
  }
);
