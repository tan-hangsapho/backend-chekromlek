import { error } from "console";
import { IPost, postModel } from "../model/post.model";

export class PostRepositories {
  async createPost(postDetail: IPost) {
    try {
      const newPost = new postModel(postDetail);
      return await newPost.save();
    } catch (error: unknown) {
      throw error;
    }
  }
  async updatePostbyId({ id, update }: { id: string; update: IPost }) {
    try {
      return await postModel.findByIdAndUpdate({ id, update }, { new: true });
    } catch (error) {
      throw error;
    }
  }
  async deletePost({ id }: { id: string }) {
    try {
      return await postModel.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }
  async findPostById({ id }: { id: string }) {
    try {
      const existingUser = await postModel.findById(id);
      return existingUser;
    } catch (erorr) {
      throw error;
    }
  }
}
