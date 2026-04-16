import { IReply } from "../replies/IReply";
import IUser from "../user/IUser";

export interface IComment {
  id: number;
  postId: number;
  userId: number;
  message: string;
  creationDate: string;
  replies?: IReply[];
  user?: IUser; // Optional user object for username/avatar
}
