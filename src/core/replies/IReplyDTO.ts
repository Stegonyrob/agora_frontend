export interface IReplyDTO {
  commentId: number;
  userId: number;
  message: string;
  tags: any[]; // <-- Añade esta línea
}
