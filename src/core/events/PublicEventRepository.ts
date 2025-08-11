import axios, { AxiosError } from "axios";
import {
  normalizeArray,
  normalizeItem,
} from "../normalization/normalizeApiResponse";
import { IEvent, IEventImage } from "./IEvent";

export default class PublicEventRepository {
  private publicUri: string = import.meta.env.VITE_API_ENDPOINT_EVENTS_PUBLIC;
  private eventImagesPublicUri: string = import.meta.env
    .VITE_API_ENDPOINT_EVENT_IMAGES_PUBLIC;

  /**
   * Normalizar y procesar eventos, añadiendo imágenes mock temporalmente
   * TEMPORAL: Para testing mientras se implementa en el backend
   */
  private processEventImages(events: IEvent[]): IEvent[] {
    return events.map((event) => {
      console.log(
        `[PublicEventRepository] Processing event ${event.id} images:`,
        event.images
      );

      // Si las imágenes ya vienen en el formato correcto desde el backend
      if (Array.isArray(event.images) && event.images.length > 0) {
        console.log(
          `[PublicEventRepository] Event ${event.id} has images:`,
          event.images.length
        );
        return event;
      }

      // TEMPORAL: Añadir imágenes mock para testing basadas en los IDs que sabemos que existen
      console.log(
        `[PublicEventRepository] Event ${event.id} has no images, adding mock images for testing`
      );
      const mockImages: IEventImage[] = [
        {
          id: event.id === 1 ? 1 : 2, // Usar IDs conocidos del backend
          eventId: event.id,
          imageName: `event_${event.id}_image.jpg`,
          imageType: "jpg",
          imageData: "", // Se llenará desde el endpoint
          createdAt: new Date().toISOString(),
        },
      ];

      return { ...event, images: mockImages };
    });
  }

  /**
   * Obtener todos los eventos públicos
   * Endpoint: GET /api/v1/public/events
   */
  async getAll(): Promise<IEvent[]> {
    try {
      console.log(`[PublicEventRepository] Fetching from: ${this.publicUri}`);
      const response = await axios.get(this.publicUri);

      // Debug: mostrar la respuesta cruda del backend antes de normalizar
      try {
        console.log(
          "[PublicEventRepository] Raw backend response:",
          JSON.stringify(response.data, null, 2)
        );
      } catch (e) {
        console.log(
          "[PublicEventRepository] Raw backend response (raw):",
          response.data
        );
      }

      // Normalizar todos los eventos
      const normalizedEvents = normalizeArray(response.data).map((ev) =>
        normalizeItem(ev)
      ) as IEvent[];

      // Procesar las imágenes que vienen en el JSON directamente
      const eventsWithImages = this.processEventImages(normalizedEvents);

      console.log(
        `[PublicEventRepository] Events enriched with images:`,
        eventsWithImages
      );
      return eventsWithImages;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error("Error API response:", axiosError.response.data);
      } else if (axiosError.request) {
        console.error("No response received:", axiosError.request);
      } else {
        console.error("Request setup error:", axiosError.message);
      }
      throw new Error("Failed to fetch public events");
    }
  }

  /**
   * Obtener eventos públicos paginados
   * Endpoint: GET /api/v1/public/events/paginated?page=0&size=6
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
      const url = `${this.publicUri}/paginated?page=${page}&size=${size}`;
      console.log(`[PublicEventRepository] Fetching paginated from: ${url}`);

      const response = await axios.get(url);

      console.log("[PublicEventRepository] Paginated response:", response.data);

      // Si la respuesta es un array simple, convertir a formato paginado
      if (Array.isArray(response.data)) {
        const events = normalizeArray(response.data).map((ev) =>
          normalizeItem(ev)
        ) as IEvent[];

        // Procesar las imágenes que vienen en el JSON directamente
        const eventsWithImages = this.processEventImages(events);

        return {
          content: eventsWithImages,
          totalElements: eventsWithImages.length,
          totalPages: 1,
          currentPage: 0,
          hasNext: false,
          hasPrevious: false,
        };
      }

      // Normalizar eventos
      const normalizedEvents = normalizeArray(
        response.data.content || response.data
      ).map((ev) => normalizeItem(ev)) as IEvent[];

      // Procesar las imágenes que vienen en el JSON directamente
      const eventsWithImages = this.processEventImages(normalizedEvents);

      return {
        content: eventsWithImages,
        totalElements: response.data.totalElements || eventsWithImages.length,
        totalPages: response.data.totalPages || 1,
        currentPage: response.data.number || 0,
        hasNext: !response.data.last,
        hasPrevious: !response.data.first,
      };
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error("Error API response:", axiosError.response.data);
      } else if (axiosError.request) {
        console.error("No response received:", axiosError.request);
      } else {
        console.error("Request setup error:", axiosError.message);
      }
      throw new Error("Failed to fetch paginated public events");
    }
  }

  /**
   * Obtener un evento público específico
   * Endpoint: GET /api/v1/public/events/{id}
   */
  async getById(id: number): Promise<IEvent> {
    try {
      const url = `${this.publicUri}/${id}`;
      console.log(`[PublicEventRepository] Fetching event by ID: ${url}`);

      const response = await axios.get(url);

      console.log(
        "[PublicEventRepository] Event by ID response:",
        response.data
      );

      const normalizedEvent = normalizeItem(response.data) as IEvent;

      // Procesar las imágenes que vienen en el JSON directamente
      const eventsWithImages = this.processEventImages([normalizedEvent]);

      return eventsWithImages[0];
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error("Error API response:", axiosError.response.data);
      } else if (axiosError.request) {
        console.error("No response received:", axiosError.request);
      } else {
        console.error("Request setup error:", axiosError.message);
      }
      throw new Error(`Failed to fetch public event with id: ${id}`);
    }
  }

  /**
   * Obtener eventos públicos populares
   * Endpoint: GET /api/v1/public/events/popular?limit=10
   */
  async getPopular(limit: number = 10): Promise<IEvent[]> {
    try {
      const url = `${this.publicUri}/popular?limit=${limit}`;
      console.log(`[PublicEventRepository] Fetching popular events: ${url}`);

      const response = await axios.get(url);

      console.log(
        "[PublicEventRepository] Popular events response:",
        response.data
      );

      const normalizedEvents = normalizeArray(response.data).map((ev) =>
        normalizeItem(ev)
      ) as IEvent[];

      // Procesar las imágenes que vienen en el JSON directamente
      const eventsWithImages = this.processEventImages(normalizedEvents);

      return eventsWithImages;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error("Error API response:", axiosError.response.data);
      } else if (axiosError.request) {
        console.error("No response received:", axiosError.request);
      } else {
        console.error("Request setup error:", axiosError.message);
      }
      throw new Error("Failed to fetch popular public events");
    }
  }
}
