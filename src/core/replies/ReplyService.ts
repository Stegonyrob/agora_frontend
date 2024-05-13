import { IReply } from "./IReply";
import { ReplyRepository } from "./ReplyRepository";

export class ReplyService {
  repository: ReplyRepository;

  constructor(repository: ReplyRepository) {
    this.repository = repository;
  }

  async get(): Promise<IReply[]> {
    const data: IReply[] = await this.repository.getAll();
    let list: IReply[] = [];

    data.forEach((reply: IReply) => {
      let template = {
        reply_id: reply.reply_id,
        post_id: reply.post_id,
        user_id: reply.user_id,
        reply_message: reply.reply_message,
        creation_date: reply.creation_date,
      };
      list.push(template);
    });

    return list;
  }

  async getByPostId(postId: number): Promise<IReply[]> {
    const data: IReply[] = await this.repository.getByPostId(postId);
    let list: IReply[] = [];

    data.forEach((reply: IReply) => {
      let template = {
        reply_id: reply.reply_id,
        post_id: reply.post_id,
        user_id: reply.user_id,
        reply_message: reply.reply_message,
        creation_date: reply.creation_date,
      };
      list.push(template);
    });

    return list;
  }

  async create(reply: IReply): Promise<IReply> {
    return await this.repository.create(reply);
  }

  async update(reply: IReply): Promise<IReply> {
    return await this.repository.update(reply);
  }

  async delete(replyId: number): Promise<void> {
    return await this.repository.delete(replyId);
  }
}