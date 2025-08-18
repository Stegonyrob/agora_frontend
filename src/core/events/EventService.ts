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

  // ========== PUBLIC METHODS (No authentication required) ==========

  // 1. Get all public events - fetchPublicEvents() (Public)
  async fetchPublicEvents(): Promise<IEvent[]> {
    console.log("Fetching all public events...");
    try {
      const events = await this.publicEventRepository.getAll();
      console.log("Public events fetched successfully.");
      return events;
    } catch (error: any) {
      console.error("Error fetching public events:", error.message);
      throw new Error(`Error fetching public events: ${error.message}`);
    }
  }

  // 1.1 Get public events with pagination - fetchPublicEventsPaginated() (Public)
  async fetchPublicEventsPaginated(page: number = 0, size: number = 6) {
    console.log(
      `Fetching public events with pagination - Page: ${page}, Size: ${size}`
    );
    try {
      const result = await this.publicEventRepository.getPaginated(page, size);
      console.log("Paginated public events fetched successfully:", result);
      return result;
    } catch (error: any) {
      console.error("Error fetching paginated public events:", error.message);
      // Fallback: Si no existe el endpoint paginado, simular paginación
      console.log("Falling back to client-side pagination...");
      const allEvents = await this.fetchPublicEvents();
      const startIndex = page * size;
      const endIndex = startIndex + size;
      const paginatedEvents = allEvents.slice(startIndex, endIndex);

      return {
        content: paginatedEvents,
        totalPages: Math.ceil(allEvents.length / size),
        number: page,
        size: size,
        totalElements: allEvents.length,
        currentPage: page,
        hasNext: endIndex < allEvents.length,
        hasPrevious: page > 0,
      };
    }
  }

  // 2. Get public event by ID - fetchPublicEventById() (Public)
  async fetchPublicEventById(id: number): Promise<IEvent> {
    console.log(`Fetching public event by ID: ${id}`);
    try {
      const event = await this.publicEventRepository.getById(id);
      console.log("Public event fetched successfully:", event);
      return event;
    } catch (error: any) {
      console.error(`Error fetching public event by ID: ${error.message}`);
      throw new Error(`Error fetching public event by ID: ${error.message}`);
    }
  }

  // 3. Get popular events - getPopularEvents() (Public)
  async getPopularEvents(limit: number = 10): Promise<IEvent[]> {
    console.log(`Fetching popular events with limit: ${limit}`);
    try {
      const events = await this.publicEventRepository.getPopular(limit);
      console.log("Popular events fetched successfully:", events);
      return events;
    } catch (error: any) {
      console.error("Error fetching popular events:", error.message);
      throw new Error(`Error fetching popular events: ${error.message}`);
    }
  }

  // ========== PRIVATE METHODS (Authentication required) ==========

  // 1. Get all events - fetchEvents() (Private)
  async fetchEvents(): Promise<IEvent[]> {
    console.log("Fetching all events (authenticated)...");
    try {
      const events = await this.eventRepository.getAll();
      console.log("Events fetched successfully (authenticated).");
      return events;
    } catch (error: any) {
      console.error("Error fetching events (authenticated):", error.message);
      throw new Error(`Error fetching events: ${error.message}`);
    }
  }

  // 1.1 Get events with pagination - fetchEventsPaginated() (Private)
  async fetchEventsPaginated(page: number = 0, size: number = 6) {
    console.log(
      `Fetching events with pagination (authenticated) - Page: ${page}, Size: ${size}`
    );
    try {
      const result = await this.eventRepository.getPaginated(page, size);
      console.log(
        "Paginated events fetched successfully (authenticated):",
        result
      );
      return result;
    } catch (error: any) {
      console.error(
        "Error fetching paginated events (authenticated):",
        error.message
      );
      // Fallback: Si no existe el endpoint paginado, simular paginación con el método normal
      console.log("Falling back to client-side pagination...");
      const allEvents = await this.fetchEvents();
      const startIndex = page * size;
      const endIndex = startIndex + size;
      const paginatedEvents = allEvents.slice(startIndex, endIndex);

      return {
        content: paginatedEvents,
        totalPages: Math.ceil(allEvents.length / size),
        number: page,
        size: size,
        totalElements: allEvents.length,
        currentPage: page,
        hasNext: endIndex < allEvents.length,
        hasPrevious: page > 0,
      };
    }
  }

  // 2. Get event by ID - fetchEventById() (Private)
  async fetchEventById(id: number): Promise<IEvent> {
    console.log(`Fetching event by ID (authenticated): ${id}`);
    try {
      const event = await this.eventRepository.getById(id);
      console.log("Event fetched successfully (authenticated):", event);
      console.log("Debug: eventDate in fetched event:", event.eventDate);
      return event;
    } catch (error: any) {
      console.error(
        `Error fetching event by ID (authenticated): ${error.message}`
      );
      throw new Error(`Error fetching event by ID: ${error.message}`);
    }
  }

  // 3. Create event - createEvent() (Admin Only)
  async createEvent(newEvent: IEventCreateDTO): Promise<IEvent> {
    console.log("🔧 EventService - Creating new event...");
    console.log("📝 EventService - Datos recibidos:", {
      title: newEvent.title,
      message: newEvent.message,
      capacity: newEvent.capacity,
      tags: newEvent.tags,
      eventDate: newEvent.eventDate,
    });

    try {
      console.log("📤 EventService - Enviando al backend:", {
        url: this.uri,
        method: "POST",
        data: newEvent,
      });
      console.log("📤 EventService - Payload sent to backend:", newEvent);

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

      console.log("✅ EventService - Event created successfully:", {
        id: response.data.id,
        title: response.data.title,
        fullResponse: response.data,
      });

      return response.data;
    } catch (error: any) {
      console.error("💥 EventService - Error creating event:", error.message);
      throw new Error(`Error creating event: ${error.message}`);
    }
  }

  // 4. Update event - updateEvent() (Admin Only)
  async updateEvent(
    id: number,
    updatedEvent: IEventUpdateDTO
  ): Promise<IEventResponseDTO> {
    console.log(`Updating event with ID: ${id}`);

    try {
      const response: AxiosResponse<IEventResponseDTO> =
        await axios.put<IEventResponseDTO>(`${this.uri}/${id}`, updatedEvent, {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
        });
      console.log("Event updated successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(`Error updating event: ${error.message}`);
      throw new Error(`Error updating event: ${error.message}`);
    }
  }

  // 5. Delete event - deleteEvent() (Admin Only)
  async deleteEvent(id: number): Promise<void> {
    console.log(`Deleting event with ID: ${id}`);
    try {
      await axios.delete(`${this.uri}/${id}`, {
        headers: getAuthHeaders(),
      });
      console.log("Event deleted successfully.");
    } catch (error: any) {
      console.error(`Error deleting event with ID ${id}:`, error.message);
      throw new Error(`Error deleting event with ID ${id}: ${error.message}`);
    }
  }

  // 6. Archive event - archiveEvent() (Admin Only)
  async archiveEvent(id: number, archive: boolean): Promise<boolean> {
    console.log(`Archiving event with ID: ${id}, archive status: ${archive}`);
    try {
      await this.eventRepository.archive(id, archive);
      console.log("Event archive status updated successfully");
      return true;
    } catch (error: any) {
      console.error(`Error archiving event with ID ${id}:`, error.message);
      throw new Error(`Error archiving event with ID ${id}: ${error.message}`);
    }
  }

  // 7. Unarchive event - unarchiveEvent() (Admin Only)
  async unarchiveEvent(id: number, archive: boolean): Promise<boolean> {
    console.log(`Unarchiving event with ID: ${id}, archive status: ${archive}`);
    try {
      await this.eventRepository.archive(id, archive);
      console.log("Event unarchive status updated successfully");
      return true;
    } catch (error: any) {
      console.error(`Error unarchiving event with ID ${id}:`, error.message);
      throw new Error(
        `Error unarchiving event with ID ${id}: ${error.message}`
      );
    }
  }

  // ========== ATTENDEE METHODS ==========

  // 8. Register attendee to event (Public)
  async registerAttendee(
    eventId: number,
    attendee: { nombre: string; correo: string; telefono: string }
  ) {
    try {
      const response = await axios.post(
        `${this.uri}/${eventId}/attendees`,
        attendee,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Error registrando asistente"
      );
    }
  }

  // ========== FAVORITES METHODS (Authentication required) ==========

  // 9. Add event to favorites
  async addToFavorites(eventId: number, userId: number): Promise<void> {
    console.log(`Adding event ${eventId} to favorites for user ${userId}`);
    try {
      await this.eventRepository.addToFavorites(eventId, userId);
      console.log("Event added to favorites successfully");
    } catch (error: any) {
      console.error("Error adding event to favorites:", error.message);
      throw new Error(`Error adding event to favorites: ${error.message}`);
    }
  }

  // 10. Remove event from favorites
  async removeFromFavorites(eventId: number, userId: number): Promise<void> {
    console.log(`Removing event ${eventId} from favorites for user ${userId}`);
    try {
      await this.eventRepository.removeFromFavorites(eventId, userId);
      console.log("Event removed from favorites successfully");
    } catch (error: any) {
      console.error("Error removing event from favorites:", error.message);
      throw new Error(`Error removing event from favorites: ${error.message}`);
    }
  }

  // 11. Get user favorite events
  async getUserFavorites(userId: number): Promise<IEvent[]> {
    console.log(`Getting favorite events for user ${userId}`);
    try {
      const favorites = await this.eventRepository.getUserFavorites(userId);
      console.log("User favorite events fetched successfully:", favorites);
      return favorites;
    } catch (error: any) {
      console.error("Error fetching user favorite events:", error.message);
      throw new Error(`Error fetching user favorite events: ${error.message}`);
    }
  }

  // ========== UTILITY METHODS ==========

  /**
   * Smart method to get events based on authentication status
   * @param isAuthenticated - Whether user is authenticated
   * @param page - Page number for pagination (optional)
   * @param size - Page size for pagination (optional)
   */
  async getEventsSmart(isAuthenticated: boolean, page?: number, size?: number) {
    if (isAuthenticated) {
      return page !== undefined && size !== undefined
        ? this.fetchEventsPaginated(page, size)
        : this.fetchEvents();
    } else {
      return page !== undefined && size !== undefined
        ? this.fetchPublicEventsPaginated(page, size)
        : this.fetchPublicEvents();
    }
  }

  /**
   * Smart method to get event by ID based on authentication status
   * @param id - Event ID
   * @param isAuthenticated - Whether user is authenticated
   */
  async getEventByIdSmart(
    id: number,
    isAuthenticated: boolean
  ): Promise<IEvent> {
    if (isAuthenticated) {
      return this.fetchEventById(id);
    } else {
      return this.fetchPublicEventById(id);
    }
  }
}
