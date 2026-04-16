import axios from "axios";
import { getAuthHeaders } from "../auth/AuthHeaders";
import {
  normalizeArray,
  normalizeItem,
} from "../normalization/normalizeApiResponse";
import { IEvent } from "./IEvent";

export default class EventRepository {
  private uri: string = import.meta.env.VITE_API_ENDPOINT_EVENTS;

  /**
   * Obtener todos los eventos (requiere autenticación)
   * Endpoint: GET /api/v1/events
   */
  async getAll(): Promise<IEvent[]> {
    try {
      const response = await axios.get(this.uri, {
        headers: getAuthHeaders(),
      });

      return normalizeArray(response.data).map((ev) =>
        normalizeItem(ev)
      ) as IEvent[];
    } catch (error) {
      throw new Error("Failed to fetch data");
    }
  }

  /**
   * Obtener eventos paginados (requiere autenticación)
   * Endpoint: GET /api/v1/events/paginated?page=0&size=6
   */
  async getPaginated(
    page: number = 0,
    size: number = 6
  ): Promise<{
    content: IEvent[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    hasNext: boolean;
    hasPrevious: boolean;
  }> {
    try {
      const url = `${this.uri}/paginated?page=${page}&size=${size}`;
      const response = await axios.get(url, {
        headers: getAuthHeaders(),
      });

      if (Array.isArray(response.data)) {
        const events = normalizeArray(response.data).map((ev) =>
          normalizeItem(ev)
        ) as IEvent[];
        return {
          content: events,
          totalElements: events.length,
          totalPages: 1,
          currentPage: 0,
          hasNext: false,
          hasPrevious: false,
        };
      }

      const normalizedEvents = normalizeArray(
        response.data.content || response.data
      ).map((ev) => normalizeItem(ev)) as IEvent[];

      return {
        content: normalizedEvents,
        totalElements: response.data.totalElements || normalizedEvents.length,
        totalPages: response.data.totalPages || 1,
        currentPage: response.data.number || 0,
        hasNext: !response.data.last,
        hasPrevious: !response.data.first,
      };
    } catch (error) {
      throw new Error("Failed to fetch paginated events");
    }
  }

  /**
   * Obtener un evento específico (requiere autenticación)
   * Endpoint: GET /api/v1/events/{id}
   */
  async getById(id: number): Promise<IEvent> {
    try {
      const url = `${this.uri}/${id}`;
      const response = await axios.get(url, {
        headers: getAuthHeaders(),
      });

      return normalizeItem(response.data) as IEvent;
    } catch (error) {
      throw new Error(`Failed to fetch event with id: ${id}`);
    }
  }

  /**
   * Crear un nuevo evento (requiere autenticación)
   * Endpoint: POST /api/v1/events
   */
  async create(eventData: Partial<IEvent>): Promise<IEvent> {
    try {
      const response = await axios.post(this.uri, eventData, {
        headers: getAuthHeaders(),
      });

      return normalizeItem(response.data) as IEvent;
    } catch (error) {
      throw new Error("Failed to create event");
    }
  }

  /**
   * Actualizar un evento existente (requiere autenticación)
   * Endpoint: PUT /api/v1/events/{id}
   */
  async update(id: number, eventData: Partial<IEvent>): Promise<IEvent> {
    try {
      const url = `${this.uri}/${id}`;
      const response = await axios.put(url, eventData, {
        headers: getAuthHeaders(),
      });

      return normalizeItem(response.data) as IEvent;
    } catch (error) {
      throw new Error(`Failed to update event with id: ${id}`);
    }
  }

  /**
   * Archivar/desarchivar un evento (requiere autenticación)
   * Endpoint: PATCH /api/v1/events/{id}/archive
   */
  async archive(id: number, archived: boolean): Promise<void> {
    try {
      const url = `${this.uri}/${id}/archive?archive=${archived}`;
      await axios.patch(url, null, {
        headers: getAuthHeaders(),
      });
    } catch (error) {
      throw new Error(`Failed to archive event with id: ${id}`);
    }
  }

  /**
   * Agregar evento a favoritos (requiere autenticación)
   * Endpoint: PUT /api/v1/events/{eventId}/favorite
   */
  async addToFavorites(eventId: number, userId: number): Promise<void> {
    try {
      const url = `${this.uri}/${eventId}/favorite?userId=${userId}`;
      await axios.put(url, null, {
        headers: getAuthHeaders(),
      });
    } catch (error) {
      throw new Error(`Failed to add event ${eventId} to favorites`);
    }
  }

  /**
   * Quitar evento de favoritos (requiere autenticación)
   * Endpoint: PUT /api/v1/events/{eventId}/unfavorite
   */
  async removeFromFavorites(eventId: number, userId: number): Promise<void> {
    try {
      const url = `${this.uri}/${eventId}/unfavorite?userId=${userId}`;
      await axios.put(url, null, {
        headers: getAuthHeaders(),
      });
    } catch (error) {
      throw new Error(`Failed to remove event ${eventId} from favorites`);
    }
  }

  /**
   * Obtener eventos favoritos de un usuario (requiere autenticación)
   * Endpoint: GET /api/v1/events/users/{userId}/favorites
   */
  async getUserFavorites(userId: number): Promise<IEvent[]> {
    try {
      const url = `${this.uri}/users/${userId}/favorites`;
      const response = await axios.get(url, {
        headers: getAuthHeaders(),
      });

      return normalizeArray(response.data).map((ev) =>
        normalizeItem(ev)
      ) as IEvent[];
    } catch (error) {
      throw new Error(`Failed to fetch favorites for user ${userId}`);
    }
  }
}
