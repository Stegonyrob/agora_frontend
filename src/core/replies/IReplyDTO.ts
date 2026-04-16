export interface IReplyDTO {
  id?: number;
  commentId: number;
  userId: number;
  message: string;
  tags: any[];
}
