import { IReply } from "../replies/IReply";

export interface IComment {
  id: number;
  postId: number;
  userId: number;
  message: string;
  creationDate: string;
  replies?: IReply[];
}
