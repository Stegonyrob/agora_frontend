export interface IReplyDTO {
  postId: number;
  commentId: number;
  userId: number;
  reply_message: string;
  creation_date?: string;
  replyId?: number; // Solo para update
}
