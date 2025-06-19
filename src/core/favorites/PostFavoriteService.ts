import { FavoriteRepository } from "./FavoriteRepository";

export default class PostFavoriteService extends FavoriteRepository {
  constructor() {
    super(import.meta.env.VITE_API_ENDPOINT_POSTS);
  }
}
