export interface ICreateTagRequest {
  name: string;
}

export interface ICreateTagResponse {
  id: number;
  name: string;
  archived: boolean;
}
