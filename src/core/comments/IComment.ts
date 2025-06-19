export interface IComment {
  id: number;
  postId: number;
  userId: number;
  title: string;
  message: string;
  creationDate: string;
  // ...otros campos según tu modelo
}
