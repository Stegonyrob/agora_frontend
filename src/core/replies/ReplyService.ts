import { IReply } from "./IReply";
import { IReplyDTO } from "./IReplyDTO";
import { ReplyRepository } from "./ReplyRepository";

export class ReplyService {
  static repository = new ReplyRepository();

  static async get(): Promise<IReply[]> {
    return await ReplyService.repository.getAll();
  }

  static async getByCommentId(commentId: number): Promise<IReply[]> {
    return await ReplyService.repository.getByCommentId(commentId);
  }

  static async create(reply: IReplyDTO): Promise<IReply> {
    return await ReplyService.repository.create(reply);
  }

  static async update(replyId: number, reply: IReplyDTO): Promise<IReply> {
    return await ReplyService.repository.update(replyId, reply);
  }

  static async delete(replyId: number): Promise<void> {
    return await ReplyService.repository.delete(replyId);
  }
}
