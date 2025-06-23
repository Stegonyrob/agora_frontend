export interface IComment {
  id: number;
  postId: number;
  userId: number;
  message: string;
  creationDate: string;
  replies?: IComment[];
  // otros campos opcionales...
}
