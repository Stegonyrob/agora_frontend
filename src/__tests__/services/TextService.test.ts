import { beforeEach, describe, expect, it, Mocked, vi } from "vitest";
import { IText } from "../../core/texts/IText";
import { ITextDTO } from "../../core/texts/ITextDTO";
import { TextRepository } from "../../core/texts/TextRepository";
import TextService from "../../core/texts/TextService";

// Mock del repository
vi.mock("../../core/texts/TextRepository");

describe("TextService", () => {
  let textService: TextService;
  let mockTextRepository: Mocked<TextRepository>;

  // Mock data
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
        imagePath: "",
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
        imageData: "",
      },
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    category: "Technology",
    name_image: "new-image.jpg",
  };

  const mockUpdateDTO: ITextDTO = {
    userId: 1,
    title: "Updated Test Text",
    images: [],
    message: "Updated test text message",
    category: "Updated Category",
    name_image: "updated-image.jpg",
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mockTextRepository = vi.mocked(new TextRepository());
    textService = new TextService(mockTextRepository);
  });

  describe("getAllTexts", () => {
    it("debería obtener todos los textos correctamente", async () => {
      // Arrange
      const mockTexts = [mockText];
      mockTextRepository.getAll.mockResolvedValue(mockTexts);

      // Act
      const result = await textService.getAllTexts();

      // Assert
      expect(mockTextRepository.getAll).toHaveBeenCalled();
      expect(result).toEqual(mockTexts);
    });

    it("debería manejar error al obtener textos", async () => {
      // Arrange
      mockTextRepository.getAll.mockRejectedValue(new Error("Database error"));

      // Act & Assert
      await expect(textService.getAllTexts()).rejects.toThrow("Database error");
    });

    it("debería retornar array vacío cuando no hay textos", async () => {
      // Arrange
      mockTextRepository.getAll.mockResolvedValue([]);

      // Act
      const result = await textService.getAllTexts();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe("getTextById", () => {
    it("debería obtener texto por ID correctamente", async () => {
      // Arrange
      mockTextRepository.getById.mockResolvedValue(mockText);

      // Act
      const result = await textService.getTextById(1);

      // Assert
      expect(mockTextRepository.getById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockText);
    });

    it("debería manejar texto no encontrado", async () => {
      // Arrange
      mockTextRepository.getById.mockRejectedValue(new Error("Text not found"));

      // Act & Assert
      await expect(textService.getTextById(999)).rejects.toThrow(
        "Text not found"
      );
    });

    it("debería validar ID de texto válido", async () => {
      // Arrange
      mockTextRepository.getById.mockResolvedValue(mockText);

      // Act
      const result = await textService.getTextById(1);

      // Assert
      expect(result.id).toBe(1);
      expect(typeof result.id).toBe("number");
    });
  });

  describe("createText", () => {
    it("debería crear texto correctamente", async () => {
      // Arrange
      mockTextRepository.create.mockResolvedValue(mockText);

      // Act
      const result = await textService.createText(mockTextDTO);

      // Assert
      expect(mockTextRepository.create).toHaveBeenCalledWith(mockTextDTO);
      expect(result).toEqual(mockText);
    });

    it("debería manejar error de validación en creación", async () => {
      // Arrange
      const invalidDTO = { ...mockTextDTO, title: "" };
      mockTextRepository.create.mockRejectedValue(
        new Error("Validation error: Title is required")
      );

      // Act & Assert
      await expect(textService.createText(invalidDTO)).rejects.toThrow(
        "Validation error: Title is required"
      );
    });

    it("debería crear texto con imágenes", async () => {
      // Arrange
      const textWithMultipleImages = {
        ...mockText,
        images: [
          {
            id: 1,
            textId: 1,
            imageName: "image1.jpg",
            imagePath: "/path/to/image1.jpg",
          },
          {
            id: 2,
            textId: 1,
            imageName: "image2.jpg",
            imagePath: "/path/to/image2.jpg",
          },
        ],
      };
      mockTextRepository.create.mockResolvedValue(textWithMultipleImages);

      // Act
      const result = await textService.createText(mockTextDTO);

      // Assert
      expect(result.images).toHaveLength(2);
      expect(result.images[0].imageName).toBe("image1.jpg");
      expect(result.images[1].imageName).toBe("image2.jpg");
    });

    it("debería manejar creación con datos mínimos", async () => {
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
      mockTextRepository.create.mockResolvedValue(minimalText);

      // Act
      const result = await textService.createText(minimalDTO);

      // Assert
      expect(result).toEqual(minimalText);
      expect(result.title).toBe("Minimal Text");
    });
  });

  describe("updateText", () => {
    it("debería actualizar texto correctamente", async () => {
      // Arrange
      const updatedText = {
        ...mockText,
        title: mockUpdateDTO.title!,
        message: mockUpdateDTO.message!,
        category: mockUpdateDTO.category!,
        name_image: mockUpdateDTO.name_image!,
        id: 1,
      };
      mockTextRepository.update.mockResolvedValue(updatedText);

      // Act
      const result = await textService.updateText(1, mockUpdateDTO);

      // Assert
      expect(mockTextRepository.update).toHaveBeenCalledWith(1, mockUpdateDTO);
      expect(result.title).toBe("Updated Test Text");
      expect(result.message).toBe("Updated test text message");
    });

    it("debería manejar texto no encontrado en actualización", async () => {
      // Arrange
      mockTextRepository.update.mockRejectedValue(new Error("Text not found"));

      // Act & Assert
      await expect(textService.updateText(999, mockUpdateDTO)).rejects.toThrow(
        "Text not found"
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
      mockTextRepository.update.mockResolvedValue(partiallyUpdatedText);

      // Act
      const result = await textService.updateText(1, partialUpdate);

      // Assert
      expect(result.title).toBe("Only Title Updated");
      expect(result.message).toBe(mockText.message); // No cambió
    });
  });

  describe("deleteText", () => {
    it("debería eliminar texto correctamente", async () => {
      // Arrange
      mockTextRepository.delete.mockResolvedValue();

      // Act
      await textService.deleteText(1);

      // Assert
      expect(mockTextRepository.delete).toHaveBeenCalledWith(1);
    });

    it("debería manejar error al eliminar texto no existente", async () => {
      // Arrange
      mockTextRepository.delete.mockRejectedValue(new Error("Text not found"));

      // Act & Assert
      await expect(textService.deleteText(999)).rejects.toThrow(
        "Text not found"
      );
    });

    it("debería manejar eliminación de texto con dependencias", async () => {
      // Arrange
      mockTextRepository.delete.mockRejectedValue(
        new Error("Cannot delete text with existing references")
      );

      // Act & Assert
      await expect(textService.deleteText(1)).rejects.toThrow(
        "Cannot delete text with existing references"
      );
    });
  });

  describe("archiveText", () => {
    it("debería archivar texto correctamente", async () => {
      // Arrange
      mockTextRepository.archive.mockResolvedValue();

      // Act
      await textService.archiveText(1, true);

      // Assert
      expect(mockTextRepository.archive).toHaveBeenCalledWith(1, true);
    });

    it("debería desarchivar texto usando archiveText", async () => {
      // Arrange
      mockTextRepository.archive.mockResolvedValue();

      // Act
      await textService.archiveText(1, false);

      // Assert
      expect(mockTextRepository.archive).toHaveBeenCalledWith(1, false);
    });

    it("debería manejar error en archivado", async () => {
      // Arrange
      mockTextRepository.archive.mockRejectedValue(
        new Error("Archive operation failed")
      );

      // Act & Assert
      await expect(textService.archiveText(1, true)).rejects.toThrow(
        "Archive operation failed"
      );
    });
  });

  describe("unArchiveText", () => {
    it("debería desarchivar texto correctamente", async () => {
      // Arrange
      mockTextRepository.archive.mockResolvedValue();

      // Act
      await textService.unArchiveText(1);

      // Assert
      expect(mockTextRepository.archive).toHaveBeenCalledWith(1, false);
    });

    it("debería manejar error en desarchivado", async () => {
      // Arrange
      mockTextRepository.archive.mockRejectedValue(
        new Error("Unarchive operation failed")
      );

      // Act & Assert
      await expect(textService.unArchiveText(1)).rejects.toThrow(
        "Unarchive operation failed"
      );
    });
  });

  describe("edge cases", () => {
    it("debería manejar textos con muchas imágenes", async () => {
      // Arrange
      const textWithManyImages = {
        ...mockText,
        images: Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          textId: 1,
          imageName: `image${i + 1}.jpg`,
          imagePath: `/path/to/image${i + 1}.jpg`,
        })),
      };
      mockTextRepository.getById.mockResolvedValue(textWithManyImages);

      const result = await textService.getTextById(1);

      // Assert
      expect(result.images).toHaveLength(10);
      expect(
        result.images.every((img) => img.imageName.includes("image"))
      ).toBe(true);
    });

    it("debería manejar texto con contenido muy largo", async () => {
      // Arrange
      const longMessage = "A".repeat(10000); // 10k characters
      const textWithLongContent = { ...mockText, message: longMessage };
      mockTextRepository.getById.mockResolvedValue(textWithLongContent);

      // Act
      const result = await textService.getTextById(1);

      // Assert
      expect(result.message.length).toBe(10000);
      expect(result.message).toBe(longMessage);
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
        mockTextRepository.getById.mockResolvedValue(textWithSpecialCategory);

        // Act
        const result = await textService.getTextById(1);

        // Assert
        expect(result.category).toBe(category);
      }
    });

    it("debería manejar fechas en diferentes formatos", async () => {
      // Arrange
      const differentDateFormats = [
        "2024-01-01T00:00:00Z",
        "2024-01-01T00:00:00.000Z",
        "2024-01-01",
        null,
      ];

      for (const dateFormat of differentDateFormats) {
        const textWithDifferentDate = { ...mockText, createdAt: dateFormat };
        mockTextRepository.getById.mockResolvedValue(textWithDifferentDate);

        // Act
        const result = await textService.getTextById(1);

        // Assert
        expect(result.createdAt).toBe(dateFormat);
      }
    });

    it("debería manejar timeout en operaciones", async () => {
      // Arrange
      mockTextRepository.getAll.mockRejectedValue(new Error("Request timeout"));

      // Act & Assert
      await expect(textService.getAllTexts()).rejects.toThrow(
        "Request timeout"
      );
    });
  });
});
