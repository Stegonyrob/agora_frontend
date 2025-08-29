import { LoveRepository } from "./LoveRepository";

export default class PostLoveService extends LoveRepository {
  constructor() {
    super(import.meta.env.VITE_API_ENDPOINT_POSTS);
  }
}
