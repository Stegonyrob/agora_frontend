import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as authHeaders from "../../../core/auth/AuthHeaders";
import EventRepository from "../../../core/events/EventRepository";
import { IEvent, IEventTag } from "../../../core/events/IEvent";
import * as normalizeApiResponse from "../../../core/normalization/normalizeApiResponse";

// Mock de axios
vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
  },
}));

// Mock de dependencias
vi.mock("../../../core/auth/AuthHeaders", () => ({
  getAuthHeaders: vi.fn(),
}));

vi.mock("../../../core/normalization/normalizeApiResponse", () => ({
  normalizeArray: vi.fn(),
  normalizeItem: vi.fn(),
}));

describe("EventRepository", () => {
  let eventRepository: EventRepository;

  const mockEventTag: IEventTag = {
    id: 1,
    name: "Technology",
    archived: false,
  };

  const mockEvent: IEvent = {
    id: 1,
    title: "Tech Conference 2024",
    message: "Annual technology conference",
    location: "Convention Center",
    loves: 15,
    isArchived: false,
    tags: [mockEventTag],
    images: ["image1.jpg", "image2.jpg"],
    isPublished: true,
    alt_image: "Tech conference alt",
    source_image: "tech-conf.jpg",
    url_avatar: "avatar.jpg",
    creationDate: "2024-01-15T10:00:00Z",
    favoritesCount: 25,
    attendentsCount: 150,
    capacity: 200,
    eventDate: "2024-03-15T14:00:00Z",
    link: "https://techconf2024.com",
  };

  const mockHeaders = { Authorization: "Bearer mock_token" };

  beforeEach(() => {
    vi.clearAllMocks();
    eventRepository = new EventRepository();

    // Setup de mocks por defecto
    vi.mocked(authHeaders.getAuthHeaders).mockReturnValue(mockHeaders);
    vi.mocked(normalizeApiResponse.normalizeArray).mockImplementation(
      (data) => data || []
    );
    vi.mocked(normalizeApiResponse.normalizeItem).mockImplementation(
      (data) => data
    );
  });

  describe("getAll", () => {
    it("debería obtener todos los eventos correctamente", async () => {
      // Arrange
      const mockResponse = { data: [mockEvent] };
      vi.mocked(axios.get).mockResolvedValue(mockResponse);

      // Act
      const result = await eventRepository.getAll();

      // Assert
      expect(axios.get).toHaveBeenCalledWith(expect.any(String), {
        headers: mockHeaders,
      });
      expect(normalizeApiResponse.normalizeArray).toHaveBeenCalledWith([
        mockEvent,
      ]);
      expect(result).toEqual([mockEvent]);
    });

    it("debería manejar error al obtener eventos", async () => {
      // Arrange
      vi.mocked(axios.get).mockRejectedValue(new Error("Network error"));

      // Act & Assert
      await expect(eventRepository.getAll()).rejects.toThrow(
        "Failed to fetch data"
      );
    });
  });

  describe("getPaginated", () => {
    it("debería obtener eventos paginados con formato completo", async () => {
      // Arrange
      const mockPaginatedResponse = {
        data: {
          content: [mockEvent],
          totalElements: 1,
          totalPages: 1,
          number: 0,
          last: true,
          first: true,
        },
      };
      vi.mocked(axios.get).mockResolvedValue(mockPaginatedResponse);

      // Act
      const result = await eventRepository.getPaginated(0, 6);

      // Assert
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining("/paginated?page=0&size=6"),
        { headers: mockHeaders }
      );
      expect(result).toEqual({
        content: [mockEvent],
        totalElements: 1,
        totalPages: 1,
        currentPage: 0,
        hasNext: false,
        hasPrevious: false,
      });
    });

    it("debería manejar respuesta de array simple", async () => {
      // Arrange
      const mockArrayResponse = { data: [mockEvent] };
      vi.mocked(axios.get).mockResolvedValue(mockArrayResponse);

      // Act
      const result = await eventRepository.getPaginated(0, 6);

      // Assert
      expect(result).toEqual({
        content: [mockEvent],
        totalElements: 1,
        totalPages: 1,
        currentPage: 0,
        hasNext: false,
        hasPrevious: false,
      });
    });

    it("debería usar parámetros por defecto", async () => {
      // Arrange
      const mockResponse = { data: [] };
      vi.mocked(axios.get).mockResolvedValue(mockResponse);

      // Act
      await eventRepository.getPaginated();

      // Assert
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining("/paginated?page=0&size=6"),
        { headers: mockHeaders }
      );
    });

    it("debería manejar error en paginación", async () => {
      // Arrange
      vi.mocked(axios.get).mockRejectedValue(new Error("Pagination error"));

      // Act & Assert
      await expect(eventRepository.getPaginated()).rejects.toThrow(
        "Failed to fetch paginated events"
      );
    });
  });

  describe("getById", () => {
    it("debería obtener evento por ID correctamente", async () => {
      // Arrange
      const mockResponse = { data: mockEvent };
      vi.mocked(axios.get).mockResolvedValue(mockResponse);

      // Act
      const result = await eventRepository.getById(1);

      // Assert
      expect(axios.get).toHaveBeenCalledWith(expect.stringMatching(/\/1$/), {
        headers: mockHeaders,
      });
      expect(normalizeApiResponse.normalizeItem).toHaveBeenCalledWith(
        mockEvent
      );
      expect(result).toEqual(mockEvent);
    });

    it("debería manejar evento no encontrado", async () => {
      // Arrange
      vi.mocked(axios.get).mockRejectedValue(new Error("Event not found"));

      // Act & Assert
      await expect(eventRepository.getById(999)).rejects.toThrow(
        "Failed to fetch event with id: 999"
      );
    });
  });

  describe("create", () => {
    it("debería crear evento correctamente", async () => {
      // Arrange
      const eventData = {
        title: "New Event",
        message: "Event description",
        location: "Test Location",
      };
      const mockResponse = { data: { ...mockEvent, ...eventData } };
      vi.mocked(axios.post).mockResolvedValue(mockResponse);

      // Act
      const result = await eventRepository.create(eventData);

      // Assert
      expect(axios.post).toHaveBeenCalledWith(expect.any(String), eventData, {
        headers: mockHeaders,
      });
      expect(result).toEqual({ ...mockEvent, ...eventData });
    });

    it("debería manejar error en creación", async () => {
      // Arrange
      vi.mocked(axios.post).mockRejectedValue(new Error("Creation failed"));

      // Act & Assert
      await expect(eventRepository.create({})).rejects.toThrow(
        "Failed to create event"
      );
    });
  });

  describe("update", () => {
    it("debería actualizar evento correctamente", async () => {
      // Arrange
      const updateData = { title: "Updated Title" };
      const mockResponse = { data: { ...mockEvent, ...updateData } };
      vi.mocked(axios.put).mockResolvedValue(mockResponse);

      // Act
      const result = await eventRepository.update(1, updateData);

      // Assert
      expect(axios.put).toHaveBeenCalledWith(
        expect.stringMatching(/\/1$/),
        updateData,
        { headers: mockHeaders }
      );
      expect(result).toEqual({ ...mockEvent, ...updateData });
    });

    it("debería manejar error en actualización", async () => {
      // Arrange
      vi.mocked(axios.put).mockRejectedValue(new Error("Update failed"));

      // Act & Assert
      await expect(eventRepository.update(1, {})).rejects.toThrow(
        "Failed to update event with id: 1"
      );
    });
  });

  describe("archive", () => {
    it("debería archivar evento correctamente", async () => {
      // Arrange
      vi.mocked(axios.patch).mockResolvedValue({});

      // Act
      await eventRepository.archive(1, true);

      // Assert
      expect(axios.patch).toHaveBeenCalledWith(
        expect.stringContaining("/1/archive?archive=true"),
        null,
        { headers: mockHeaders }
      );
    });

    it("debería desarchivar evento correctamente", async () => {
      // Arrange
      vi.mocked(axios.patch).mockResolvedValue({});

      // Act
      await eventRepository.archive(1, false);

      // Assert
      expect(axios.patch).toHaveBeenCalledWith(
        expect.stringContaining("/1/archive?archive=false"),
        null,
        { headers: mockHeaders }
      );
    });

    it("debería manejar error en archivado", async () => {
      // Arrange
      vi.mocked(axios.patch).mockRejectedValue(new Error("Archive failed"));

      // Act & Assert
      await expect(eventRepository.archive(1, true)).rejects.toThrow(
        "Failed to archive event with id: 1"
      );
    });
  });

  describe("addToFavorites", () => {
    it("debería agregar evento a favoritos correctamente", async () => {
      // Arrange
      vi.mocked(axios.put).mockResolvedValue({});

      // Act
      await eventRepository.addToFavorites(1, 100);

      // Assert
      expect(axios.put).toHaveBeenCalledWith(
        expect.stringContaining("/1/favorite?userId=100"),
        null,
        { headers: mockHeaders }
      );
    });

    it("debería manejar error al agregar a favoritos", async () => {
      // Arrange
      vi.mocked(axios.put).mockRejectedValue(new Error("Favorite failed"));

      // Act & Assert
      await expect(eventRepository.addToFavorites(1, 100)).rejects.toThrow(
        "Failed to add event 1 to favorites"
      );
    });
  });

  describe("removeFromFavorites", () => {
    it("debería quitar evento de favoritos correctamente", async () => {
      // Arrange
      vi.mocked(axios.put).mockResolvedValue({});

      // Act
      await eventRepository.removeFromFavorites(1, 100);

      // Assert
      expect(axios.put).toHaveBeenCalledWith(
        expect.stringContaining("/1/unfavorite?userId=100"),
        null,
        { headers: mockHeaders }
      );
    });

    it("debería manejar error al quitar de favoritos", async () => {
      // Arrange
      vi.mocked(axios.put).mockRejectedValue(new Error("Unfavorite failed"));

      // Act & Assert
      await expect(eventRepository.removeFromFavorites(1, 100)).rejects.toThrow(
        "Failed to remove event 1 from favorites"
      );
    });
  });

  describe("getUserFavorites", () => {
    it("debería obtener favoritos del usuario correctamente", async () => {
      // Arrange
      const mockResponse = { data: [mockEvent] };
      vi.mocked(axios.get).mockResolvedValue(mockResponse);

      // Act
      const result = await eventRepository.getUserFavorites(100);

      // Assert
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining("/users/100/favorites"),
        { headers: mockHeaders }
      );
      expect(result).toEqual([mockEvent]);
    });

    it("debería manejar error al obtener favoritos", async () => {
      // Arrange
      vi.mocked(axios.get).mockRejectedValue(
        new Error("Favorites fetch failed")
      );

      // Act & Assert
      await expect(eventRepository.getUserFavorites(100)).rejects.toThrow(
        "Failed to fetch favorites for user 100"
      );
    });
  });

  describe("edge cases", () => {
    it("debería manejar respuesta vacía en getAll", async () => {
      // Arrange
      const mockResponse = { data: [] };
      vi.mocked(axios.get).mockResolvedValue(mockResponse);

      // Act
      const result = await eventRepository.getAll();

      // Assert
      expect(result).toEqual([]);
    });

    it("debería manejar datos malformados en paginación", async () => {
      // Arrange
      const mockResponse = { data: null };
      vi.mocked(axios.get).mockResolvedValue(mockResponse);
      vi.mocked(normalizeApiResponse.normalizeArray).mockReturnValue([]);

      // Act & Assert
      await expect(eventRepository.getPaginated()).rejects.toThrow(
        "Failed to fetch paginated events"
      );
    });

    it("debería manejar ID de evento inválido", async () => {
      // Arrange
      vi.mocked(axios.get).mockRejectedValue(new Error("Invalid ID"));

      // Act & Assert
      await expect(eventRepository.getById(-1)).rejects.toThrow(
        "Failed to fetch event with id: -1"
      );
    });
  });
});
