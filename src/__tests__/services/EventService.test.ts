import axios from "axios";
import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import EventRepository from "../../core/events/EventRepository";
import EventService from "../../core/events/EventService";
import { IEvent } from "../../core/events/IEvent";
import {
  IEventCreateDTO,
  IEventResponseDTO,
  IEventUpdateDTO,
} from "../../core/events/IEventBackendDTO";
import PublicEventRepository from "../../core/events/PublicEventRepository";

// Mock de los repositories y axios
vi.mock("../../core/events/EventRepository");
vi.mock("../../core/events/PublicEventRepository");
vi.mock("../../core/auth/AuthHeaders");
vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    get: vi.fn(),
  },
}));

describe("EventService", () => {
  let eventService: EventService;
  let mockEventRepository: Mocked<EventRepository>;
  let mockPublicEventRepository: Mocked<PublicEventRepository>;

  // Mock data
  const mockEvent: IEvent = {
    id: 1,
    title: "Test Event",
    message: "Test event description",
    location: "Madrid, Spain",
    loves: 5,
    isArchived: false,
    tags: [
      { id: 1, name: "Technology", archived: false },
      { id: 2, name: "Workshop", archived: false },
    ],
    images: ["image1.jpg", "image2.jpg"],
    isPublished: true,
    alt_image: "Alt text for image",
    source_image: "source1.jpg",
    url_avatar: "avatar1.jpg",
    creationDate: "2024-01-01T00:00:00Z",
    favoritesCount: 10,
    attendentsCount: 25,
    capacity: 50,
    eventDate: "2024-12-25T18:00:00Z",
    endDate: "2024-12-25T22:00:00Z",
    link: "https://example.com/event",
  };

  const mockCreateDTO: IEventCreateDTO = {
    title: "New Test Event",
    message: "New event description",
    capacity: 100,
    eventDate: "2024-12-30T19:00:00Z",
    eventTime: "19:00",
    tags: [
      { id: 1, name: "Technology" },
      { id: 2, name: "Workshop" },
    ],
  };

  const mockUpdateDTO: IEventUpdateDTO = {
    title: "Updated Event",
    message: "Updated description",
    capacity: 75,
  };

  const mockEventResponseDTO: IEventResponseDTO = {
    id: 1,
    title: "Updated Event",
    message: "Updated description",
    archived: false,
    capacity: 75,
    attendeesCount: 25,
    attendees: [],
    tags: ["Technology", "Workshop"],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Reset environment
    delete process.env.VITE_API_ENDPOINT_EVENTS;

    mockEventRepository = vi.mocked(new EventRepository());
    mockPublicEventRepository = vi.mocked(new PublicEventRepository());

    eventService = new EventService();
    (eventService as any).eventRepository = mockEventRepository;
    (eventService as any).publicEventRepository = mockPublicEventRepository;
  });

  describe("fetchPublicEvents", () => {
    it("debería obtener eventos públicos correctamente", async () => {
      // Arrange
      const mockEvents = [mockEvent];
      mockPublicEventRepository.getAll.mockResolvedValue(mockEvents);

      // Act
      const result = await eventService.fetchPublicEvents();

      // Assert
      expect(mockPublicEventRepository.getAll).toHaveBeenCalled();
      expect(result).toEqual(mockEvents);
    });

    it("debería manejar error al obtener eventos públicos", async () => {
      // Arrange
      mockPublicEventRepository.getAll.mockRejectedValue(
        new Error("API Error")
      );

      // Act & Assert
      await expect(eventService.fetchPublicEvents()).rejects.toThrow(
        "API Error"
      );
    });
  });

  describe("fetchPublicEventsPaginated", () => {
    it("debería obtener eventos paginados con parámetros por defecto", async () => {
      // Arrange
      const mockResponse = {
        content: [mockEvent],
        totalElements: 1,
        totalPages: 1,
        currentPage: 0,
        hasNext: false,
        hasPrevious: false,
      };
      mockPublicEventRepository.getPaginated.mockResolvedValue(mockResponse);

      // Act
      const result = await eventService.fetchPublicEventsPaginated();

      // Assert
      expect(mockPublicEventRepository.getPaginated).toHaveBeenCalledWith(0, 6);
      expect(result).toEqual(mockResponse);
    });

    it("debería obtener eventos paginados con parámetros personalizados", async () => {
      // Arrange
      const mockResponse = {
        content: [mockEvent],
        totalElements: 15,
        totalPages: 2,
        currentPage: 1,
        hasNext: false,
        hasPrevious: true,
      };
      mockPublicEventRepository.getPaginated.mockResolvedValue(mockResponse);

      // Act
      const result = await eventService.fetchPublicEventsPaginated(1, 10);

      // Assert
      expect(mockPublicEventRepository.getPaginated).toHaveBeenCalledWith(
        1,
        10
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("fetchPublicEventById", () => {
    it("debería obtener evento público por ID", async () => {
      // Arrange
      mockPublicEventRepository.getById.mockResolvedValue(mockEvent);

      // Act
      const result = await eventService.fetchPublicEventById(1);

      // Assert
      expect(mockPublicEventRepository.getById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockEvent);
    });

    it("debería manejar evento no encontrado", async () => {
      // Arrange
      mockPublicEventRepository.getById.mockRejectedValue(
        new Error("Event not found")
      );

      // Act & Assert
      await expect(eventService.fetchPublicEventById(999)).rejects.toThrow(
        "Event not found"
      );
    });
  });

  describe("fetchEvents (autenticado)", () => {
    it("debería obtener eventos privados con autenticación", async () => {
      // Arrange
      const mockEvents = [mockEvent];
      mockEventRepository.getAll.mockResolvedValue(mockEvents);

      // Act
      const result = await eventService.fetchEvents();

      // Assert
      expect(mockEventRepository.getAll).toHaveBeenCalled();
      expect(result).toEqual(mockEvents);
    });
  });

  describe("createEvent", () => {
    it("debería crear evento correctamente", async () => {
      // Arrange
      const mockResponse = { data: mockEvent };
      vi.mocked(axios.post).mockResolvedValue(mockResponse);

      // Act
      const result = await eventService.createEvent(mockCreateDTO);

      // Assert
      expect(axios.post).toHaveBeenCalled();
      expect(result).toEqual(mockEvent);
    });

    it("debería manejar error de validación en creación", async () => {
      // Arrange
      const invalidDTO = { ...mockCreateDTO, title: "" };
      vi.mocked(axios.post).mockRejectedValue(new Error("Validation error"));

      // Act & Assert
      await expect(eventService.createEvent(invalidDTO)).rejects.toThrow(
        "Validation error"
      );
    });
  });

  describe("updateEvent", () => {
    it("debería actualizar evento correctamente", async () => {
      // Arrange
      const mockResponse = { data: mockEventResponseDTO };
      vi.mocked(axios.put).mockResolvedValue(mockResponse);

      // Act
      const result = await eventService.updateEvent(1, mockUpdateDTO);

      // Assert
      expect(axios.put).toHaveBeenCalled();
      expect(result).toEqual(mockEventResponseDTO);
    });

    it("debería manejar evento no encontrado en actualización", async () => {
      // Arrange
      vi.mocked(axios.put).mockRejectedValue(new Error("Event not found"));

      // Act & Assert
      await expect(
        eventService.updateEvent(999, mockUpdateDTO)
      ).rejects.toThrow("Event not found");
    });
  });

  describe("deleteEvent", () => {
    it("debería eliminar evento correctamente", async () => {
      // Arrange
      vi.mocked(axios.delete).mockResolvedValue({});

      // Act
      await eventService.deleteEvent(1);

      // Assert
      expect(axios.delete).toHaveBeenCalled();
    });

    it("debería manejar error al eliminar evento no existente", async () => {
      // Arrange
      vi.mocked(axios.delete).mockRejectedValue(new Error("Event not found"));

      // Act & Assert
      await expect(eventService.deleteEvent(999)).rejects.toThrow(
        "Event not found"
      );
    });
  });

  describe("archiveEvent", () => {
    it("debería archivar evento correctamente", async () => {
      // Arrange
      mockEventRepository.archive.mockResolvedValue();

      // Act
      const result = await eventService.archiveEvent(1, true);

      // Assert
      expect(mockEventRepository.archive).toHaveBeenCalledWith(1, true);
      expect(result).toBe(true);
    });

    it("debería desarchivar evento correctamente", async () => {
      // Arrange
      mockEventRepository.archive.mockResolvedValue();

      // Act
      const result = await eventService.unarchiveEvent(1, false);

      // Assert
      expect(mockEventRepository.archive).toHaveBeenCalledWith(1, false);
      expect(result).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("debería manejar eventos con muchos asistentes", async () => {
      // Arrange
      const crowdedEvent = {
        ...mockEvent,
        attendentsCount: 1000,
        capacity: 1000,
      };
      mockPublicEventRepository.getById.mockResolvedValue(crowdedEvent);

      // Act
      const result = await eventService.fetchPublicEventById(1);

      // Assert
      expect(result.attendentsCount).toBe(1000);
      expect(result.capacity).toBe(1000);
    });

    it("debería manejar eventos sin imágenes", async () => {
      // Arrange
      const eventWithoutImages = { ...mockEvent, images: [] };
      mockPublicEventRepository.getById.mockResolvedValue(eventWithoutImages);

      // Act
      const result = await eventService.fetchPublicEventById(1);

      // Assert
      expect(result.images).toEqual([]);
    });

    it("debería manejar fechas de evento válidas", async () => {
      // Arrange
      const futureEvent = {
        ...mockEvent,
        eventDate: new Date(Date.now() + 86400000).toISOString(), // Mañana
        endDate: new Date(Date.now() + 90000000).toISOString(), // Mañana + 1 hora
      };
      const mockResponse = { data: futureEvent };
      vi.mocked(axios.post).mockResolvedValue(mockResponse);

      // Act
      const createDTO = {
        ...mockCreateDTO,
        eventDate: futureEvent.eventDate,
      };
      const result = await eventService.createEvent(createDTO);

      // Assert
      expect(new Date(result.eventDate).getTime()).toBeGreaterThan(Date.now());
    });

    it("debería manejar timeout en operaciones", async () => {
      // Arrange
      mockPublicEventRepository.getAll.mockRejectedValue(
        new Error("Request timeout")
      );

      // Act & Assert
      await expect(eventService.fetchPublicEvents()).rejects.toThrow(
        "Request timeout"
      );
    });
  });
});
