import axios from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as authHeaders from "../../../core/auth/AuthHeaders";
import { IText } from "../../../core/texts/IText";
import { ITextDTO } from "../../../core/texts/ITextDTO";
import { TextRepository } from "../../../core/texts/TextRepository";

// Mock de axios
vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  },
}));

// Mock de dependencias
vi.mock("../../../core/auth/AuthHeaders", () => ({
  getAuthHeaders: vi.fn(),
}));

describe("TextRepository", () => {
  let textRepository: TextRepository;

  const mockText: IText = {
    id: 1,
    title: "Test Text",
    category: "Technology",
    updatedAt: "2024-01-01T00:00:00Z",
    message: "This is a test text message",
    images: [
      {
        id: 1,
        textId: 1,
        imageName: "test-image.jpg",
        imagePath: "/path/to/test-image.jpg",
      },
    ],
    name_image: "test-image.jpg",
    archived: false,
  };

  const mockTextDTO: ITextDTO = {
    userId: 1,
    title: "New Test Text",
    images: [
      {
        id: 1,
        textId: 1,
        category: "Technology",
        imageName: "new-image.jpg",
        imageType: "image/jpeg",
        imageData: "base64imagedata",
      },
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    category: "Technology",
    name_image: "new-image.jpg",
  };

  const mockHeaders = { Authorization: "Bearer mock_token" };

  beforeEach(() => {
    vi.clearAllMocks();
    textRepository = new TextRepository();

    // Setup de mocks por defecto
    vi.mocked(authHeaders.getAuthHeaders).mockReturnValue(mockHeaders);
  });

  describe("getAll", () => {
    it("debería obtener todos los textos correctamente", async () => {
      // Arrange
      const mockResponse = { data: [mockText] };
      vi.mocked(axios.get).mockResolvedValue(mockResponse);

      // Act
      const result = await textRepository.getAll();

      // Assert
      expect(axios.get).toHaveBeenCalledWith(expect.any(String), {
        headers: mockHeaders,
      });
      expect(result).toEqual([mockText]);
    });

    it("debería manejar error al obtener textos", async () => {
      // Arrange
      vi.mocked(axios.get).mockRejectedValue(new Error("Network error"));

      // Act & Assert
      await expect(textRepository.getAll()).rejects.toThrow("Network error");
    });

    it("debería retornar array vacío cuando no hay textos", async () => {
      // Arrange
      const mockResponse = { data: [] };
      vi.mocked(axios.get).mockResolvedValue(mockResponse);

      // Act
      const result = await textRepository.getAll();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe("getById", () => {
    it("debería obtener texto por ID correctamente", async () => {
      // Arrange
      const mockResponse = { data: mockText };
      vi.mocked(axios.get).mockResolvedValue(mockResponse);

      // Act
      const result = await textRepository.getById(1);

      // Assert
      expect(axios.get).toHaveBeenCalledWith(expect.stringMatching(/\/1$/), {
        headers: mockHeaders,
      });
      expect(result).toEqual(mockText);
    });

    it("debería manejar texto no encontrado", async () => {
      // Arrange
      vi.mocked(axios.get).mockRejectedValue(new Error("Text not found"));

      // Act & Assert
      await expect(textRepository.getById(999)).rejects.toThrow(
        "Text not found"
      );
    });

    it("debería validar ID de texto válido", async () => {
      // Arrange
      const mockResponse = { data: mockText };
      vi.mocked(axios.get).mockResolvedValue(mockResponse);

      // Act
      const result = await textRepository.getById(1);

      // Assert
      expect(result.id).toBe(1);
      expect(typeof result.id).toBe("number");
    });
  });

  describe("create", () => {
    it("debería crear texto correctamente", async () => {
      // Arrange
      const mockResponse = { data: mockText };
      vi.mocked(axios.post).mockResolvedValue(mockResponse);

      // Act
      const result = await textRepository.create(mockTextDTO);

      // Assert
      expect(axios.post).toHaveBeenCalledWith(expect.any(String), mockTextDTO, {
        headers: mockHeaders,
      });
      expect(result).toEqual(mockText);
    });

    it("debería manejar error de validación en creación", async () => {
      // Arrange
      const error = new Error("Validation error: Title is required");
      vi.mocked(axios.post).mockRejectedValue(error);

      // Act & Assert
      await expect(textRepository.create(mockTextDTO)).rejects.toThrow(
        "Validation error: Title is required"
      );
    });

    it("debería crear texto con datos mínimos", async () => {
      // Arrange
      const minimalDTO: ITextDTO = {
        userId: 1,
        title: "Minimal Text",
        images: [],
        name_image: "default.jpg",
      };
      const minimalText: IText = {
        id: 2,
        title: "Minimal Text",
        category: "General",
        message: "",
        images: [],
        name_image: "default.jpg",
        archived: false,
      };
      const mockResponse = { data: minimalText };
      vi.mocked(axios.post).mockResolvedValue(mockResponse);

      // Act
      const result = await textRepository.create(minimalDTO);

      // Assert
      expect(result).toEqual(minimalText);
    });

    it("debería manejar error de servidor en creación", async () => {
      // Arrange
      const serverError = { response: { status: 500 } };
      vi.mocked(axios.post).mockRejectedValue(serverError);

      // Act & Assert
      await expect(textRepository.create(mockTextDTO)).rejects.toEqual(
        serverError
      );
    });
  });

  describe("update", () => {
    it("debería actualizar texto correctamente", async () => {
      // Arrange
      const updatedText = { ...mockText, title: "Updated Title" };
      const mockResponse = { data: updatedText };
      vi.mocked(axios.put).mockResolvedValue(mockResponse);

      // Act
      const result = await textRepository.update(1, mockTextDTO);

      // Assert
      expect(axios.put).toHaveBeenCalledWith(
        expect.stringMatching(/\/1$/),
        mockTextDTO,
        { headers: mockHeaders }
      );
      expect(result).toEqual(updatedText);
    });

    it("debería manejar texto no encontrado en actualización (error 500)", async () => {
      // Arrange
      const error500 = { response: { status: 500 } };
      vi.mocked(axios.put).mockRejectedValue(error500);

      // Act & Assert
      await expect(textRepository.update(999, mockTextDTO)).rejects.toThrow(
        "El texto ID 999 no existe en el servidor. Puede que haya sido eliminado."
      );
    });

    it("debería manejar otros errores en actualización", async () => {
      // Arrange
      const error400 = { response: { status: 400 } };
      vi.mocked(axios.put).mockRejectedValue(error400);

      // Act & Assert
      await expect(textRepository.update(1, mockTextDTO)).rejects.toEqual(
        error400
      );
    });

    it("debería actualizar solo campos modificados", async () => {
      // Arrange
      const partialUpdate: ITextDTO = {
        userId: 1,
        title: "Only Title Updated",
        images: [],
        name_image: "same-image.jpg",
      };
      const partiallyUpdatedText = { ...mockText, title: "Only Title Updated" };
      const mockResponse = { data: partiallyUpdatedText };
      vi.mocked(axios.put).mockResolvedValue(mockResponse);

      // Act
      const result = await textRepository.update(1, partialUpdate);

      // Assert
      expect(result.title).toBe("Only Title Updated");
      expect(result.message).toBe(mockText.message); // No cambió
    });
  });

  describe("delete", () => {
    it("debería eliminar texto correctamente", async () => {
      // Arrange
      vi.mocked(axios.delete).mockResolvedValue({});

      // Act
      await textRepository.delete(1);

      // Assert
      expect(axios.delete).toHaveBeenCalledWith(expect.stringMatching(/\/1$/), {
        headers: mockHeaders,
      });
    });

    it("debería manejar error al eliminar texto no existente", async () => {
      // Arrange
      vi.mocked(axios.delete).mockRejectedValue(new Error("Text not found"));

      // Act & Assert
      await expect(textRepository.delete(999)).rejects.toThrow(
        "Text not found"
      );
    });

    it("debería manejar eliminación de texto con dependencias", async () => {
      // Arrange
      const dependencyError = new Error(
        "Cannot delete text with existing references"
      );
      vi.mocked(axios.delete).mockRejectedValue(dependencyError);

      // Act & Assert
      await expect(textRepository.delete(1)).rejects.toThrow(
        "Cannot delete text with existing references"
      );
    });

    it("debería validar ID antes de eliminar", async () => {
      // Arrange
      vi.mocked(axios.delete).mockRejectedValue(new Error("Invalid ID"));

      // Act & Assert
      await expect(textRepository.delete(-1)).rejects.toThrow("Invalid ID");
    });
  });

  describe("archive", () => {
    it("debería archivar texto correctamente", async () => {
      // Arrange
      vi.mocked(axios.patch).mockResolvedValue({});

      // Act
      await textRepository.archive(1, true);

      // Assert
      expect(axios.patch).toHaveBeenCalledWith(
        expect.stringContaining("/1/archive?archive=true"),
        null,
        { headers: mockHeaders }
      );
    });

    it("debería desarchivar texto correctamente", async () => {
      // Arrange
      vi.mocked(axios.patch).mockResolvedValue({});

      // Act
      await textRepository.archive(1, false);

      // Assert
      expect(axios.patch).toHaveBeenCalledWith(
        expect.stringContaining("/1/archive?archive=false"),
        null,
        { headers: mockHeaders }
      );
    });

    it("debería manejar error en archivado", async () => {
      // Arrange
      vi.mocked(axios.patch).mockRejectedValue(
        new Error("Archive operation failed")
      );

      // Act & Assert
      await expect(textRepository.archive(1, true)).rejects.toThrow(
        "Archive operation failed"
      );
    });

    it("debería manejar permisos insuficientes para archivar", async () => {
      // Arrange
      const unauthorizedError = { response: { status: 403 } };
      vi.mocked(axios.patch).mockRejectedValue(unauthorizedError);

      // Act & Assert
      await expect(textRepository.archive(1, true)).rejects.toEqual(
        unauthorizedError
      );
    });
  });

  describe("edge cases", () => {
    it("debería manejar respuesta con texto sin imágenes", async () => {
      // Arrange
      const textWithoutImages = { ...mockText, images: [] };
      const mockResponse = { data: textWithoutImages };
      vi.mocked(axios.get).mockResolvedValue(mockResponse);

      // Act
      const result = await textRepository.getById(1);

      // Assert
      expect(result.images).toEqual([]);
    });

    it("debería manejar texto con muchas imágenes", async () => {
      // Arrange
      const textWithManyImages = {
        ...mockText,
        images: Array.from({ length: 20 }, (_, i) => ({
          id: i + 1,
          textId: 1,
          imageName: `image${i + 1}.jpg`,
          imagePath: `/path/to/image${i + 1}.jpg`,
        })),
      };
      const mockResponse = { data: textWithManyImages };
      vi.mocked(axios.get).mockResolvedValue(mockResponse);

      // Act
      const result = await textRepository.getById(1);

      // Assert
      expect(result.images).toHaveLength(20);
      expect(
        result.images.every((img) => img.imageName.includes("image"))
      ).toBe(true);
    });

    it("debería manejar categorías especiales", async () => {
      // Arrange
      const specialCategories = [
        "技術",
        "Tecnología",
        "🔧 Tech",
        "test@category",
      ];

      for (const category of specialCategories) {
        const textWithSpecialCategory = { ...mockText, category };
        const mockResponse = { data: textWithSpecialCategory };
        vi.mocked(axios.get).mockResolvedValue(mockResponse);

        // Act
        const result = await textRepository.getById(1);

        // Assert
        expect(result.category).toBe(category);
      }
    });

    it("debería manejar timeout en operaciones", async () => {
      // Arrange
      vi.mocked(axios.get).mockRejectedValue(new Error("Request timeout"));

      // Act & Assert
      await expect(textRepository.getAll()).rejects.toThrow("Request timeout");
    });

    it("debería manejar respuesta malformada", async () => {
      // Arrange
      const malformedResponse = { data: null };
      vi.mocked(axios.get).mockResolvedValue(malformedResponse);

      // Act
      const result = await textRepository.getAll();

      // Assert
      expect(result).toBeNull();
    });

    it("debería manejar ID de texto inválido", async () => {
      // Arrange
      vi.mocked(axios.get).mockRejectedValue(new Error("Invalid text ID"));

      // Act & Assert
      await expect(textRepository.getById(0)).rejects.toThrow(
        "Invalid text ID"
      );
    });
  });
});
