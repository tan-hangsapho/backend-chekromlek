import mongoose from "mongoose";

export interface PostQuestions {
  title: string;
  content: string;
  postStamp: Date; // Add postedAt property
  authorId: mongoose.Schema.Types.ObjectId;
  likes: number;
  asnwers: string;
  image?: string;
  category: string;
}

const postQuestionsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, auto: true },
  category: { type: String, required: true },
  likes: { type: Number, default: 0 },
  answers: { type: String },
  image: { type: String },
  postStamp: { type: Date, default: Date.now },
});

const PostQuestionsModel = mongoose.model<PostQuestions>(
  "Post",
  postQuestionsSchema
);

export default PostQuestionsModel;
