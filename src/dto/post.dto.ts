export class PostDTO {
  title: string;
  message: string;
  creationDate?: string;

  constructor(title: string, message: string, creationDate?: string) {
    this.title = title;
    this.message = message;
    this.creationDate = creationDate;
  }
}
