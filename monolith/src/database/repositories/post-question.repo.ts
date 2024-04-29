import CustomError from "../../errors/custom-erorrs";
import { StatusCode } from "../../utils/consts/status-code";
import PostQuestionsModel, {
  PostQuestions,
} from "../models/post-questions.models";
import {
  CreatePostType,
  UpdatePostRepository,
} from "./@types/post-question.types";

export class PostRepository {
  async createPost(post: CreatePostType) {
    try {
      const newPost = new PostQuestionsModel(post);
      return await newPost.save();
    } catch (error) {
      throw new CustomError(error.message, StatusCode.BadRequest);
    }
  }
  async deleteById(id: string): Promise<PostQuestions> {
    return PostQuestionsModel.findByIdAndDelete(id);
  }
  async updateById({
    id,
    updatePost,
  }: {
    id: string;
    updatePost: UpdatePostRepository;
  }) {}
}
