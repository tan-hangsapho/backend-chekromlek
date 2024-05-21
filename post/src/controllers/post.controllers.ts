import { IPost } from "@post/database/model/post.model";
import { validateInput } from "@post/middlewares/validate-input";
import { postSchema } from "@post/schemas/post.schema";
import { PostServices } from "@post/services/post.services";
import { Body, Route, Tags, Middlewares, Post, Put, Path, Get } from "tsoa";
@Route("/v1/post")
@Tags("Post")
export class PostControllers {
  private postServices: PostServices;
  constructor() {
    this.postServices = new PostServices();
  }
  @Post("/")
  @Middlewares(validateInput(postSchema))
  public async createPost(@Body() reqBody: IPost): Promise<any> {
    try {
        
      const post = await this.postServices.createPost(reqBody);
      return {
        message: "Post create successfully",
        data: post,
      };
    } catch (error: unknown) {
      throw error;
    }
  }
  @Put("/:id")
  public async updatePost(
    @Path() id: string,
    @Body() reqBody: IPost
  ): Promise<any> {
    try {
      const updatepost = await this.postServices.updatePost({
        id,
        updatePost: reqBody,
      });
      return {
        message: "Edit post successfully",
        data: updatepost,
      };
    } catch (error: unknown) {
      throw error;
    }
  }
  @Get("/:id")
  public async deletePost(@Path() id: string) {
    try {
      await this.postServices.deletePost({ id });
      return {
        message: "Post Deleted Successfully",
      };
    } catch (error: unknown) {
      throw error;
    }
  }
}
