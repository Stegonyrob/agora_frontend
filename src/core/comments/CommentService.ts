// src/core/comments/CommentService.ts
import { CommentDTO } from "./CommentDTO";
import { CommentRepository } from "./CommentRepository";
import { IComment } from "./IComment";

const repository = new CommentRepository();

export class CommentService {
  static async getByPostId(postId: number): Promise<IComment[]> {
    return await repository.getByPostId(postId);
  }

  static async create(dto: CommentDTO): Promise<IComment> {
    return await repository.create(dto);
  }

  static async update(id: number, dto: CommentDTO): Promise<IComment> {
    return await repository.update(id, dto);
  }

  static async delete(id: number): Promise<void> {
    return await repository.delete(id);
  }
}
