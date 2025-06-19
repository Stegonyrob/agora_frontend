export interface CommentDTO {
  id?: number;
  postId: number;
  userId: number;
  title: string;
  message: string;
  creationDate?: string;
  // otros campos...
}
