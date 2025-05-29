import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { IEvent } from "./IEvent";
import { IEventDTO } from "./IEventDTO";

// Index:
// 1. Get all events - fetchEvents()
// 2. Get event by ID - fetchEventById()
// 3. Create event - createEvent()
// 4. Update event - updateEvent()
// 5. Delete event - deleteEvent()
// 6. Archive event - archiveEvent()
// 7. Unarchive event - unarchiveEvent()
// 8. Register attendee to event (Public)

export default class EventService {
  private uri: string = import.meta.env.VITE_API_ENDPOINT_EVENTS;

  // 1. Get all events - fetchEvents() (Public)
  async fetchEvents(): Promise<IEvent[]> {
    console.log("Fetching all events...");
    try {
      const response: AxiosResponse<IEvent[]> = await axios.get<IEvent[]>(
        this.uri,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response Data:", response.data);
      console.log("Events fetched successfully.");
      return response.data;
    } catch (error: any) {
      console.error("Error fetching events:", error.message);
      throw new Error(`Error fetching events: ${error.message}`);
    } finally {
      console.log("End fetching events.");
    }
  }

  // 2. Get event by ID - fetchEventById() (Public)
  async fetchEventById(id: number): Promise<IEvent> {
    console.log(`Fetching event by ID: ${id}`);
    try {
      const response: AxiosResponse<IEvent> = await axios.get<IEvent>(
        `${this.uri}/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Event fetched successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching event by ID: ${error.message}`);
      throw new Error(`Error fetching event by ID: ${error.message}`);
    }
  }

  // 3. Create event - createEvent() (Admin Only)
  async createEvent(newEvent: IEventDTO): Promise<IEvent> {
    console.log("Creating new event...");
    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    };

    try {
      const response: AxiosResponse<IEvent> = await axios.post<IEvent>(
        this.uri,
        newEvent,
        config
      );
      console.log("Event created successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error creating event:", error.message);
      throw new Error(`Error creating event: ${error.message}`);
    }
  }

  // 4. Update event - updateEvent() (Admin Only)
  async updateEvent(id: number, updatedEvent: IEventDTO): Promise<IEvent> {
    console.log(`Updating event with ID: ${id}`);
    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    };

    try {
      const response: AxiosResponse<IEvent> = await axios.put<IEvent>(
        `${this.uri}/${id}`,
        updatedEvent,
        config
      );
      console.log("Event updated successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(`Error updating event with ID ${id}:`, error.message);
      throw new Error(`Error updating event with ID ${id}: ${error.message}`);
    }
  }

  // 5. Delete event - deleteEvent() (Admin Only)
  async deleteEvent(id: number): Promise<void> {
    console.log(`Deleting event with ID: ${id}`);
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    };

    try {
      await axios.delete(`${this.uri}/${id}`, config);
      console.log("Event deleted successfully.");
    } catch (error: any) {
      console.error(`Error deleting event with ID ${id}:`, error.message);
      throw new Error(`Error deleting event with ID ${id}: ${error.message}`);
    }
  }

  // 6. Archive event - archiveEvent() (Admin Only)
  async archiveEvent(id: number, archive: boolean): Promise<boolean> {
    console.log(`Archiving event with ID: ${id}, archive status: ${archive}`);
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    };

    try {
      const response = await axios.patch(
        `${this.uri}/${id}/archive?archive=${archive}`,
        null,
        config
      );
      console.log("Event archive status updated successfully:", response.data);
      return true;
    } catch (error: any) {
      console.error(`Error archiving event with ID ${id}:`, error.message);
      throw new Error(`Error archiving event with ID ${id}: ${error.message}`);
    }
  }

  // 7. Unarchive event - unarchiveEvent() (Admin Only)
  async unarchiveEvent(id: number, archive: boolean): Promise<boolean> {
    console.log(`Unarchiving event with ID: ${id}, archive status: ${archive}`);
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    };

    try {
      const response = await axios.patch(
        `${this.uri}/${id}/archive?archive=${archive}`,
        null,
        config
      );
      console.log(
        "Event unarchive status updated successfully:",
        response.data
      );
      return true;
    } catch (error: any) {
      console.error(`Error unarchiving event with ID ${id}:`, error.message);
      throw new Error(
        `Error unarchiving event with ID ${id}: ${error.message}`
      );
    }
  }
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
}
