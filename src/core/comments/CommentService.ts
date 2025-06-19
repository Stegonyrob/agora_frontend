import { CommentRepository } from "./CommentRepository";
import { IComment } from "./IComment";

export class CommentService {
  repository: CommentRepository;

  constructor(repository: CommentRepository) {
    this.repository = repository;
  }

  async getAll(): Promise<IComment[]> {
    return await this.repository.getAll();
  }

  async getByPostId(postId: number): Promise<IComment[]> {
    return await this.repository.getByPostId(postId);
  }

  async create(comment: IComment): Promise<IComment> {
    return await this.repository.create(comment);
  }

  async update(comment: IComment): Promise<IComment> {
    return await this.repository.update(comment);
  }

  async delete(commentId: number): Promise<void> {
    return await this.repository.delete(commentId);
  }
}
