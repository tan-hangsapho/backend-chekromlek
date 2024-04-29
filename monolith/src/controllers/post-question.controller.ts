import { Body, Post, Route, SuccessResponse, Tags } from "tsoa";
import { PostQuestionService } from "../services/post-question.service";
import { StatusCode } from "../utils/consts/status-code";
import { PostQuestions } from "../database/models/post-questions.models";

@Route("CreatePost")
@Tags("PostQuestion")
export class PostQuestionControllers {
  private postQuestionService: PostQuestionService;
  constructor() {
    this.postQuestionService = new PostQuestionService();
  }
  @SuccessResponse(StatusCode.Created, "Created")
  @Post("/createpost")
  public async createPost(
    @Body() reqBody: PostQuestions
  ): Promise<PostQuestions> {
    return await this.postQuestionService.create(reqBody);
  }
}
