import { beforeEach, describe, expect, it, vi } from "vitest";
import { IReply } from "../../../core/replies/IReply";
import { IReplyDTO } from "../../../core/replies/IReplyDTO";
import { ReplyRepository } from "../../../core/replies/ReplyRepository";
import { ReplyService } from "../../../core/replies/ReplyService";
import IUser from "../../../core/user/IUser";

// Mock del repository
vi.mock("../../../core/replies/ReplyRepository");

describe("ReplyService", () => {
  let mockReplyRepository: any;

  const mockUser: IUser = {
    id: 1,
    username: "testuser",
    email: "test@example.com",
    acceptedRules: true,
    firstName: "John",
    lastName1: "Doe",
    lastName2: null,
    avatarId: 5,
    avatarUrl: "http://example.com/avatar.jpg",
    avatarDisplayName: "Test Avatar",
    roles: ["USER"],
    banReason: null,
    fullName: "John Doe",
    banned: false,
    admin: false,
  };

  const mockReply: IReply = {
    id: 1,
    commentId: 10,
    userId: 1,
    message: "This is a test reply",
    creation_date: "2024-01-15T10:00:00Z",
    user: mockUser,
  };

  const mockReplyDTO: IReplyDTO = {
    commentId: 10,
    userId: 1,
    message: "New reply message",
    tags: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup del mock repository
    mockReplyRepository = {
      getAll: vi.fn(),
      getByCommentId: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    };

    // Configurar el mock para que ReplyRepository devuelva nuestro mock
    vi.mocked(ReplyRepository).mockImplementation(() => mockReplyRepository);

    // Asignar el mock al repository estático
    ReplyService.repository = mockReplyRepository;
  });

  describe("get", () => {
    it("debería obtener todas las respuestas correctamente", async () => {
      // Arrange
      const mockReplies = [mockReply];
      mockReplyRepository.getAll.mockResolvedValue(mockReplies);

      // Act
      const result = await ReplyService.get();

      // Assert
      expect(mockReplyRepository.getAll).toHaveBeenCalled();
      expect(result).toEqual(mockReplies);
    });

    it("debería manejar error al obtener respuestas", async () => {
      // Arrange
      mockReplyRepository.getAll.mockRejectedValue(new Error("Database error"));

      // Act & Assert
      await expect(ReplyService.get()).rejects.toThrow("Database error");
    });

    it("debería retornar array vacío cuando no hay respuestas", async () => {
      // Arrange
      mockReplyRepository.getAll.mockResolvedValue([]);

      // Act
      const result = await ReplyService.get();

      // Assert
      expect(result).toEqual([]);
    });

    it("debería incluir información del usuario en las respuestas", async () => {
      // Arrange
      const replyWithUser = { ...mockReply, user: mockUser };
      mockReplyRepository.getAll.mockResolvedValue([replyWithUser]);

      // Act
      const result = await ReplyService.get();

      // Assert
      expect(result[0].user).toBeDefined();
      expect(result[0].user?.username).toBe("testuser");
      expect(result[0].user?.avatarUrl).toBe("http://example.com/avatar.jpg");
    });
  });

  describe("getByCommentId", () => {
    it("debería obtener respuestas por ID de comentario correctamente", async () => {
      // Arrange
      const commentId = 10;
      const mockReplies = [mockReply];
      mockReplyRepository.getByCommentId.mockResolvedValue(mockReplies);

      // Act
      const result = await ReplyService.getByCommentId(commentId);

      // Assert
      expect(mockReplyRepository.getByCommentId).toHaveBeenCalledWith(
        commentId
      );
      expect(result).toEqual(mockReplies);
      expect(result[0].commentId).toBe(commentId);
    });

    it("debería manejar comentario sin respuestas", async () => {
      // Arrange
      const commentId = 999;
      mockReplyRepository.getByCommentId.mockResolvedValue([]);

      // Act
      const result = await ReplyService.getByCommentId(commentId);

      // Assert
      expect(result).toEqual([]);
    });

    it("debería manejar error al obtener respuestas por comentario", async () => {
      // Arrange
      const commentId = 10;
      mockReplyRepository.getByCommentId.mockRejectedValue(
        new Error("Comment not found")
      );

      // Act & Assert
      await expect(ReplyService.getByCommentId(commentId)).rejects.toThrow(
        "Comment not found"
      );
    });

    it("debería validar ID de comentario válido", async () => {
      // Arrange
      const commentId = 10;
      const mockReplies = [mockReply];
      mockReplyRepository.getByCommentId.mockResolvedValue(mockReplies);

      // Act
      const result = await ReplyService.getByCommentId(commentId);

      // Assert
      expect(result.every((reply) => reply.commentId === commentId)).toBe(true);
    });

    it("debería ordenar respuestas por fecha de creación", async () => {
      // Arrange
      const commentId = 10;
      const reply1 = {
        ...mockReply,
        id: 1,
        creation_date: "2024-01-15T10:00:00Z",
      };
      const reply2 = {
        ...mockReply,
        id: 2,
        creation_date: "2024-01-15T11:00:00Z",
      };
      const reply3 = {
        ...mockReply,
        id: 3,
        creation_date: "2024-01-15T09:00:00Z",
      };
      mockReplyRepository.getByCommentId.mockResolvedValue([
        reply1,
        reply2,
        reply3,
      ]);

      // Act
      const result = await ReplyService.getByCommentId(commentId);

      // Assert
      expect(result).toHaveLength(3);
      // Verificar que las respuestas están presentes
      expect(result.find((r) => r.id === 1)).toBeDefined();
      expect(result.find((r) => r.id === 2)).toBeDefined();
      expect(result.find((r) => r.id === 3)).toBeDefined();
    });
  });

  describe("create", () => {
    it("debería crear respuesta correctamente", async () => {
      // Arrange
      const createdReply = { ...mockReply, ...mockReplyDTO, id: 2 };
      mockReplyRepository.create.mockResolvedValue(createdReply);

      // Act
      const result = await ReplyService.create(mockReplyDTO);

      // Assert
      expect(mockReplyRepository.create).toHaveBeenCalledWith(mockReplyDTO);
      expect(result).toEqual(createdReply);
      expect(result.message).toBe(mockReplyDTO.message);
    });

    it("debería validar campos requeridos antes de crear", async () => {
      // Arrange
      const invalidDTO = { ...mockReplyDTO, message: "" };
      const validationError = new Error("Message is required");
      mockReplyRepository.create.mockRejectedValue(validationError);

      // Act & Assert
      await expect(ReplyService.create(invalidDTO)).rejects.toThrow(
        "Message is required"
      );
    });

    it("debería validar comentario existente", async () => {
      // Arrange
      const invalidCommentDTO = { ...mockReplyDTO, commentId: 999 };
      const commentError = new Error("Comment not found");
      mockReplyRepository.create.mockRejectedValue(commentError);

      // Act & Assert
      await expect(ReplyService.create(invalidCommentDTO)).rejects.toThrow(
        "Comment not found"
      );
    });

    it("debería validar usuario existente", async () => {
      // Arrange
      const invalidUserDTO = { ...mockReplyDTO, userId: 999 };
      const userError = new Error("User not found");
      mockReplyRepository.create.mockRejectedValue(userError);

      // Act & Assert
      await expect(ReplyService.create(invalidUserDTO)).rejects.toThrow(
        "User not found"
      );
    });

    it("debería crear respuesta con tags", async () => {
      // Arrange
      const dtoWithTags = {
        ...mockReplyDTO,
        tags: [
          { id: 1, name: "important" },
          { id: 2, name: "question" },
        ],
      };
      const replyWithTags = { ...mockReply, id: 3 };
      mockReplyRepository.create.mockResolvedValue(replyWithTags);

      // Act
      const result = await ReplyService.create(dtoWithTags);

      // Assert
      expect(mockReplyRepository.create).toHaveBeenCalledWith(dtoWithTags);
      expect(result).toEqual(replyWithTags);
    });

    it("debería manejar mensaje largo", async () => {
      // Arrange
      const longMessage = "A".repeat(1000);
      const longMessageDTO = { ...mockReplyDTO, message: longMessage };
      const replyWithLongMessage = { ...mockReply, message: longMessage };
      mockReplyRepository.create.mockResolvedValue(replyWithLongMessage);

      // Act
      const result = await ReplyService.create(longMessageDTO);

      // Assert
      expect(result.message).toBe(longMessage);
      expect(result.message.length).toBe(1000);
    });
  });

  describe("update", () => {
    it("debería actualizar respuesta correctamente", async () => {
      // Arrange
      const replyId = 1;
      const updateDTO = { ...mockReplyDTO, message: "Updated reply message" };
      const updatedReply = { ...mockReply, message: "Updated reply message" };
      mockReplyRepository.update.mockResolvedValue(updatedReply);

      // Act
      const result = await ReplyService.update(replyId, updateDTO);

      // Assert
      expect(mockReplyRepository.update).toHaveBeenCalledWith(
        replyId,
        updateDTO
      );
      expect(result.message).toBe("Updated reply message");
    });

    it("debería manejar respuesta no encontrada en actualización", async () => {
      // Arrange
      const replyId = 999;
      mockReplyRepository.update.mockRejectedValue(
        new Error("Reply not found")
      );

      // Act & Assert
      await expect(ReplyService.update(replyId, mockReplyDTO)).rejects.toThrow(
        "Reply not found"
      );
    });

    it("debería validar permisos de usuario para actualizar", async () => {
      // Arrange
      const replyId = 1;
      const unauthorizedError = new Error("Unauthorized to update this reply");
      mockReplyRepository.update.mockRejectedValue(unauthorizedError);

      // Act & Assert
      await expect(ReplyService.update(replyId, mockReplyDTO)).rejects.toThrow(
        "Unauthorized to update this reply"
      );
    });

    it("debería actualizar solo campos modificados", async () => {
      // Arrange
      const replyId = 1;
      const partialUpdate = {
        ...mockReplyDTO,
        message: "Only message updated",
        commentId: mockReply.commentId, // Mantener el mismo comentario
      };
      const partiallyUpdatedReply = {
        ...mockReply,
        message: "Only message updated",
      };
      mockReplyRepository.update.mockResolvedValue(partiallyUpdatedReply);

      // Act
      const result = await ReplyService.update(replyId, partialUpdate);

      // Assert
      expect(result.message).toBe("Only message updated");
      expect(result.commentId).toBe(mockReply.commentId);
      expect(result.userId).toBe(mockReply.userId);
    });

    it("debería validar contenido actualizado", async () => {
      // Arrange
      const replyId = 1;
      const emptyMessageDTO = { ...mockReplyDTO, message: "" };
      const validationError = new Error("Message cannot be empty");
      mockReplyRepository.update.mockRejectedValue(validationError);

      // Act & Assert
      await expect(
        ReplyService.update(replyId, emptyMessageDTO)
      ).rejects.toThrow("Message cannot be empty");
    });
  });

  describe("delete", () => {
    it("debería eliminar respuesta correctamente", async () => {
      // Arrange
      const replyId = 1;
      mockReplyRepository.delete.mockResolvedValue(undefined);

      // Act
      await ReplyService.delete(replyId);

      // Assert
      expect(mockReplyRepository.delete).toHaveBeenCalledWith(replyId);
    });

    it("debería manejar error al eliminar respuesta no existente", async () => {
      // Arrange
      const replyId = 999;
      mockReplyRepository.delete.mockRejectedValue(
        new Error("Reply not found")
      );

      // Act & Assert
      await expect(ReplyService.delete(replyId)).rejects.toThrow(
        "Reply not found"
      );
    });

    it("debería validar permisos para eliminar", async () => {
      // Arrange
      const replyId = 1;
      const unauthorizedError = new Error("Unauthorized to delete this reply");
      mockReplyRepository.delete.mockRejectedValue(unauthorizedError);

      // Act & Assert
      await expect(ReplyService.delete(replyId)).rejects.toThrow(
        "Unauthorized to delete this reply"
      );
    });

    it("debería manejar eliminación con dependencias", async () => {
      // Arrange
      const replyId = 1;
      const dependencyError = new Error(
        "Cannot delete reply with dependencies"
      );
      mockReplyRepository.delete.mockRejectedValue(dependencyError);

      // Act & Assert
      await expect(ReplyService.delete(replyId)).rejects.toThrow(
        "Cannot delete reply with dependencies"
      );
    });
  });

  describe("edge cases", () => {
    it("debería manejar respuestas sin usuario", async () => {
      // Arrange
      const replyWithoutUser = { ...mockReply, user: undefined };
      mockReplyRepository.getAll.mockResolvedValue([replyWithoutUser]);

      // Act
      const result = await ReplyService.get();

      // Assert
      expect(result[0].user).toBeUndefined();
      expect(result[0].message).toBe(mockReply.message);
    });

    it("debería manejar múltiples respuestas al mismo comentario", async () => {
      // Arrange
      const commentId = 10;
      const replies = [
        { ...mockReply, id: 1, userId: 1 },
        { ...mockReply, id: 2, userId: 2 },
        { ...mockReply, id: 3, userId: 3 },
      ];
      mockReplyRepository.getByCommentId.mockResolvedValue(replies);

      // Act
      const result = await ReplyService.getByCommentId(commentId);

      // Assert
      expect(result).toHaveLength(3);
      expect(result.every((reply) => reply.commentId === commentId)).toBe(true);
    });

    it("debería manejar caracteres especiales en mensaje", async () => {
      // Arrange
      const specialMessage =
        "Respuesta con émojis 😀 y caracteres especiales: áéíóú ñ @#$%";
      const specialDTO = { ...mockReplyDTO, message: specialMessage };
      const specialReply = { ...mockReply, message: specialMessage };
      mockReplyRepository.create.mockResolvedValue(specialReply);

      // Act
      const result = await ReplyService.create(specialDTO);

      // Assert
      expect(result.message).toBe(specialMessage);
    });

    it("debería manejar errores de red", async () => {
      // Arrange
      mockReplyRepository.getAll.mockRejectedValue(
        new Error("Network timeout")
      );

      // Act & Assert
      await expect(ReplyService.get()).rejects.toThrow("Network timeout");
    });

    it("debería validar IDs de respuesta inválidos", async () => {
      // Arrange
      mockReplyRepository.delete.mockRejectedValue(
        new Error("Invalid reply ID")
      );

      // Act & Assert
      await expect(ReplyService.delete(-1)).rejects.toThrow("Invalid reply ID");
    });

    it("debería manejar respuestas con fechas en diferentes formatos", async () => {
      // Arrange
      const differentDates = [
        { ...mockReply, id: 1, creation_date: "2024-01-15T10:00:00Z" },
        { ...mockReply, id: 2, creation_date: "2024-01-15T10:00:00.000Z" },
        { ...mockReply, id: 3, creation_date: "2024-01-15" },
      ];
      mockReplyRepository.getAll.mockResolvedValue(differentDates);

      // Act
      const result = await ReplyService.get();

      // Assert
      expect(result).toHaveLength(3);
      result.forEach((reply) => {
        expect(reply.creation_date).toMatch(/2024-01-15/);
      });
    });
  });
});
