import CustomError from "../../errors/custom-erorrs";
import { StatusCode } from "../../utils/consts/status-code";
import PostQuestionsModel, {
  PostQuestions,
} from "../models/post-questions.models";
import {
  CreatePostType,
  UpdatePostRepository,
} from "./@types/post-question.types";

class PostRepository {
  async createPost(post: CreatePostType) {
    try {
      const newPost = new PostQuestionsModel(post);
      return await newPost.save();
    } catch (error: any) {
      throw new CustomError(error.message, StatusCode.BadRequest);
    }
  }
  async updateById({
    id,
    updatePost,
  }: {
    id: string;
    updatePost: UpdatePostRepository;
  }) {}
}
