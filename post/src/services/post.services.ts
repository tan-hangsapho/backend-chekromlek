import { IPost } from "@post/database/model/post.model";
import { PostRepositories } from "@post/database/repositories/post.repo";
import APIError from "@post/errors/api-error";
import { StatusCode } from "@post/utils/const";

export class PostServices {
  private postRepo: PostRepositories;
  constructor() {
    this.postRepo = new PostRepositories();
  }
  async createPost(postDetail: IPost) {
    try {
      return await this.postRepo.createPost(postDetail);
    } catch (error: unknown) {
      throw error;
    }
  }
  async updatePost({ id, updatePost }: { id: string; updatePost: IPost }) {
    try {
      const isExisting = await this.postRepo.findPostById({ id });
      if (!isExisting) {
        throw new APIError("Post doesn't exist", StatusCode.NotFound);
      }
      return this.postRepo.updatePostbyId({ id, update: updatePost });
    } catch (error: unknown) {
      throw error;
    }
  }
  async deletePost({ id }: { id: string }) {
    try {
      const isExistPost = await this.postRepo.findPostById({ id });
      if (!isExistPost) {
        throw new APIError("Post doesn't exist", StatusCode.NotFound);
      }
      return await this.postRepo.deletePost({ id });
    } catch (error: unknown) {
      throw error;
    }
  }
  async findPost({ id }: { id: string }) {
    try {
      const isExistPost = await this.postRepo.findPostById({ id });
      if (!isExistPost) {
        throw new APIError("Post doesn't exist", StatusCode.NotFound);
      }
      return isExistPost;
    } catch (error: unknown) {
      throw error;
    }
  }
}
