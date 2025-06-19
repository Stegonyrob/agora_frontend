import { IReply } from "./IReply";
import { IReplyDTO } from "./IReplyDTO";
import { ReplyRepository } from "./ReplyRepository";

export class ReplyService {
  repository: ReplyRepository;

  constructor(repository = new ReplyRepository()) {
    this.repository = repository;
  }

  async get(): Promise<IReply[]> {
    return await this.repository.getAll();
  }

  async getByPostId(postId: number): Promise<IReply[]> {
    return await this.repository.getByPostId(postId);
  }

  async create(reply: IReplyDTO): Promise<IReply> {
    return await this.repository.create(reply);
  }

  async update(reply: IReplyDTO): Promise<IReply> {
    return await this.repository.update(reply);
  }

  async delete(replyId: number): Promise<void> {
    return await this.repository.delete(replyId);
  }
}
