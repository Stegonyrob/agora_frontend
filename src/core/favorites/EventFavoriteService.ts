import { FavoriteRepository } from "./FavoriteRepository";

export default class EventFavoriteService extends FavoriteRepository {
  constructor() {
    super(import.meta.env.VITE_API_ENDPOINT_EVENTS);
  }
}
