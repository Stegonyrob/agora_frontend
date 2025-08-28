import IUser from "../user/IUser";

export interface IReply {
  id: number;
  commentId: number;
  userId: number;
  message: string;
  creation_date: string;
  user?: IUser; // Optional user object for username/avatar
}
