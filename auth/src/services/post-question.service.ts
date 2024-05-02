import { PostQuestions } from "../database/models/post-questions.models";
import { PostRepository } from "../database/repositories/post-question.repo";

export class PostQuestionService {
  repo: PostRepository;

  constructor() {
    this.repo = new PostRepository();
  }

  async create(post: PostQuestions) {
    return await this.repo.createPost(post);
  }
  async deleteById(movieId: string) {
    return await this.repo.deleteById(movieId);
  }
}
