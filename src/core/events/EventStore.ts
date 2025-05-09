import EventService from "./EventService";
import { IEvent } from "./IEvent";
import { IEventDTO } from "./IEventDTO";

// Define el store de posts en Redux
export const eventStore = {
  state: () => ({
    events: [] as IEvent[], // Arreglo de posts
    isLoaded: false as boolean, // Indicador de si los posts han sido cargados
  }),

  actions: {
    // Acción para obtener todos los posts
    async getAllEvents(this: any): Promise<IEvent[]> {
      const eventService = new EventService();
      const events = await eventService.fetchEvents();
      this.events = events;
      this.isLoaded = true;
      return this.events;
    },

    async saveEvent(this: any, event: IEventDTO): Promise<void> {
      if (!event) {
        throw new Error("Event is null or undefined");
      }

      const eventService = new EventService();
      try {
        const newEvent = await eventService.createEvent(event);
        this.events.push(newEvent);
        this.isLoaded = true;
      } catch (error: any) {
        console.error("Error saving event:", error.message);
        throw new Error(`Error saving event: ${error.message}`);
      }
    },

    // Action to update an existing event
    async updateEvent(
      this: any,
      updatedEventData: IEventDTO,
      eventId: number
    ): Promise<void> {
      if (!updatedEventData) {
        throw new Error("Updated event data is null or undefined");
      }

      const eventService = new EventService();
      try {
        const updatedEvent = await eventService.updateEvent(
          eventId,
          updatedEventData
        );
        const index = this.events.findIndex(
          (event: { id: number }) => event.id === eventId
        );

        if (index !== -1) {
          this.events[index] = updatedEvent;
        } else {
          console.error(`Event with ID ${eventId} not found.`);
        }
      } catch (error: any) {
        console.error(
          `Error updating event with ID ${eventId}:`,
          error.message
        );
        throw new Error(
          `Error updating event with ID ${eventId}: ${error.message}`
        );
      }
    },

    // Action to delete a event
    async deleteEvent(this: any, eventId: number): Promise<void> {
      if (isNaN(eventId)) {
        throw new Error("Event ID is not a number");
      }

      const eventService = new EventService();
      try {
        await eventService.deleteEvent(eventId);
        const index = this.events.findIndex(
          (event: { id: number }) => event.id === eventId
        );
        if (index === -1) {
          console.error(`Event with ID ${eventId} not found.`);
        } else {
          this.events.splice(index, 1);
        }
      } catch (error: any) {
        console.error(
          `Error deleting event with ID ${eventId}:`,
          error.message
        );
        throw new Error(
          `Error deleting event with ID ${eventId}: ${error.message}`
        );
      }
    },
  },
};
export type EventStore = typeof eventStore;
