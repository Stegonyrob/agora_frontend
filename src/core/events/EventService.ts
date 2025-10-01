import axios, { AxiosResponse } from "axios";
import { getAuthHeaders } from "../auth/AuthHeaders";
import EventRepository from "./EventRepository";
import { IEvent } from "./IEvent";
import {
  IEventCreateDTO,
  IEventResponseDTO,
  IEventUpdateDTO,
} from "./IEventBackendDTO";
import PublicEventRepository from "./PublicEventRepository";

// Index:
// 1. PUBLIC METHODS (No authentication required)
//    - fetchPublicEvents()
//    - fetchPublicEventsPaginated()
//    - fetchPublicEventById()
//    - getPopularEvents()
// 2. PRIVATE METHODS (Authentication required)
//    - fetchEvents()
//    - fetchEventsPaginated()
//    - fetchEventById()
//    - createEvent()
//    - updateEvent()
//    - deleteEvent()
//    - archiveEvent()
//    - unarchiveEvent()
// 3. ATTENDEE METHODS
//    - registerAttendee()
// 4. FAVORITES METHODS
//    - addToFavorites()
//    - removeFromFavorites()
//    - getUserFavorites()

export default class EventService {
  private uri: string = import.meta.env.VITE_API_ENDPOINT_EVENTS;
  private eventRepository: EventRepository;
  private publicEventRepository: PublicEventRepository;

  constructor() {
    this.eventRepository = new EventRepository();
    this.publicEventRepository = new PublicEventRepository();
  }

  // --- MÉTODOS PÚBLICOS (sin autenticación) ---
  async fetchPublicEvents(): Promise<IEvent[]> {
    return await this.publicEventRepository.getAll();
  }

  async fetchPublicEventsPaginated(page: number = 0, size: number = 6) {
    try {
      return await this.publicEventRepository.getPaginated(page, size);
    } catch {
      const allEvents = await this.fetchPublicEvents();
      const start = page * size;
      const end = start + size;
      return {
        content: allEvents.slice(start, end),
        totalPages: Math.ceil(allEvents.length / size),
        number: page,
        size,
        totalElements: allEvents.length,
        currentPage: page,
        hasNext: end < allEvents.length,
        hasPrevious: page > 0,
      };
    }
  }

  async fetchPublicEventById(id: number): Promise<IEvent> {
    return await this.publicEventRepository.getById(id);
  }

  async getPopularEvents(limit: number = 10): Promise<IEvent[]> {
    return await this.publicEventRepository.getPopular(limit);
  }

  // --- MÉTODOS PRIVADOS (requieren autenticación) ---
  async fetchEvents(): Promise<IEvent[]> {
    return await this.eventRepository.getAll();
  }

  async fetchEventsPaginated(page: number = 0, size: number = 6) {
    try {
      return await this.eventRepository.getPaginated(page, size);
    } catch {
      const allEvents = await this.fetchEvents();
      const start = page * size;
      const end = start + size;
      return {
        content: allEvents.slice(start, end),
        totalPages: Math.ceil(allEvents.length / size),
        number: page,
        size,
        totalElements: allEvents.length,
        currentPage: page,
        hasNext: end < allEvents.length,
        hasPrevious: page > 0,
      };
    }
  }

  async fetchEventById(id: number): Promise<IEvent> {
    return await this.eventRepository.getById(id);
  }

  async createEvent(newEvent: IEventCreateDTO): Promise<IEvent> {
    const response: AxiosResponse<IEvent> = await axios.post<IEvent>(
      this.uri,
      newEvent,
      {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      }
    );
    return response.data;
  }

  async updateEvent(
    id: number,
    updatedEvent: IEventUpdateDTO
  ): Promise<IEventResponseDTO> {
    const response: AxiosResponse<IEventResponseDTO> =
      await axios.put<IEventResponseDTO>(`${this.uri}/${id}`, updatedEvent, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      });
    return response.data;
  }

  async deleteEvent(id: number): Promise<void> {
    await axios.delete(`${this.uri}/${id}`, {
      headers: getAuthHeaders(),
    });
  }

  async archiveEvent(id: number, archive: boolean): Promise<boolean> {
    await this.eventRepository.archive(id, archive);
    return true;
  }

  async unarchiveEvent(id: number, archive: boolean): Promise<boolean> {
    await this.eventRepository.archive(id, archive);
    return true;
  }

  // --- MÉTODOS DE FAVORITOS ---
  async addToFavorites(eventId: number, userId: number): Promise<void> {
    return await this.eventRepository.addToFavorites(eventId, userId);
  }

  async removeFromFavorites(eventId: number, userId: number): Promise<void> {
    return await this.eventRepository.removeFromFavorites(eventId, userId);
  }

  async getUserFavorites(userId: number): Promise<IEvent[]> {
    return await this.eventRepository.getUserFavorites(userId);
  }

  // --- MÉTODOS UTILITARIOS ---
  async getEventsSmart(isAuthenticated: boolean, page?: number, size?: number) {
    if (isAuthenticated) {
      return await this.fetchEventsPaginated(page, size);
    } else {
      return await this.fetchPublicEventsPaginated(page, size);
    }
  }

  async getEventByIdSmart(
    id: number,
    isAuthenticated: boolean
  ): Promise<IEvent> {
    if (isAuthenticated) {
      return await this.fetchEventById(id);
    } else {
      return await this.fetchPublicEventById(id);
    }
  }
}
