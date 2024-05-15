import mongoose from 'mongoose';

export interface IPost {
 _id?: string;
 title: string;
 content?: string;
 userId?: string;
 likes?: number;
 answer?: string;
 image?: string;
 category: string;
 createdAt?: Date;
}

const postModel = new mongoose.Schema({
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String , required: true },
    content: { type: String, required: true },
    likes: { type: Number, default: 0 },
    answer: { type: String },
    image: { type: String },
    category: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
}, {
    toJSON: {
        transform(_doc, ret) {
          delete ret.userId;
          delete ret.__v;
        },
      },
})