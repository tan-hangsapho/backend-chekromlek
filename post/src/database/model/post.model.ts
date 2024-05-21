import mongoose, { Types } from "mongoose";

export interface IPost {
  _id?: string;
  title?: string;
  content?: string;
  userId?: Types.ObjectId;
  likes?: number;
  answer?: string;
  image?: string;
  categories:
    | "Mathematic"
    | "Physical"
    | "Chemistry"
    | "Biology"
    | "Writing"
    | "Histroy"
    | "English"
    | "General Knowledge"
    | "Metal consultant"
    | "Technology";
  createdAt?: Date;
}

const Post = new mongoose.Schema(
  {
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, required: true },
    content: { type: String, required: true },
    likes: { type: Number, default: 0 },
    answer: { type: String },
    image: { type: String },
    categories: {
      type: String,
      enum: [
        "Mathematic",
        "Physical",
        "Chemistry",
        "Biology",
        "Writing",
        "Histroy",
        "English",
        "General Knowledge",
        "Metal consultant",
        "Technology",
      ],
    },
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

export const postModel = mongoose.model("Post", Post);
