import mongoose, { Types } from 'mongoose';

export interface IUser {
  _id?: string;
  username: string;
  email: string;
  profile: string;
  favorites?: Types.ObjectId[];
  questions?: Types.ObjectId[];
  bio?: string;
  work: string;
  answers: number;
  posts: number;
  gender?: string;
  createdAt?: Date | string;
}

const userSchema = new mongoose.Schema({
  username: { type: String, require: true },
  email: { type: String, required: true, unique: true },
  profile: { type: String, require: true },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  bio: { type: String },
  gender: { type: String, default: 'other' },
  work: [{ type: String, default: 'Student' }],
  answers: { type: Number, default: 0 },
  posts: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export const UserModel = mongoose.model('User', userSchema);
