import { beforeEach, describe, expect, it, vi } from "vitest";
import { IPost } from "../../../core/posts/IPost";
import { IPostDTO } from "../../../core/posts/IPostDTO";
import PostRepository, { Page } from "../../../core/posts/PostRepository";
import PostService from "../../../core/posts/PostService";
import { IPostImage } from "../../../core/posts/images/IPostImage";
import { PostImageService } from "../../../core/posts/images/PostImageService";

// Mocks
vi.mock("../../../core/posts/PostRepository");
vi.mock("../../../core/posts/images/PostImageService");

describe("PostService", () => {
  let postService: PostService;
  let mockRepository: any;
  let mockImageService: any;

  const mockPost: IPost = {
    id: 1,
    title: "Test Post",
    message: "This is a test post",
    userId: 1,
    location: "Test Location",
    loves: 5,
    comments: [],
    isArchived: false,
    tags: ["tag1", "tag2"],
    images: [],
    isPublished: true,
    alt_image: "Test alt image",
    source_image: "test-source.jpg",
    alt_avatar: "Test alt avatar",
    source_avatar: "test-avatar.jpg",
    userName: "testuser",
    role: "USER",
    url_avatar: "http://example.com/avatar.jpg",
    creationDate: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    createdAt: "2024-01-15T10:00:00Z",
    description: "Test description",
    ondelete: vi.fn(),
    favoritesCount: 3,
    commentsCount: 2,
    user: { id: 1, username: "testuser" },
  };

  const mockPostDTO: IPostDTO = {
    id: 1,
    title: "New Test Post",
    message: "This is a new test post",
    userId: 1,
    location: "New Location",
    loves: 0,
    comments: [],
    isArchived: false,
    tags: [{ id: 1, name: "newTag" }],
    images: [],
    isPublished: true,
    alt_image: "New alt image",
    source_image: "new-source.jpg",
    alt_avatar: "New alt avatar",
    source_avatar: "new-avatar.jpg",
    userName: "newuser",
    role: "USER",
    url_avatar: "http://example.com/new-avatar.jpg",
    updatedAt: "2024-01-15T11:00:00Z",
    createdAt: "2024-01-15T11:00:00Z",
    description: "New test description",
  };

  const mockPostImage: IPostImage = {
    id: 1,
    imageName: "test-image.jpg",
    imagePath: "/path/to/image.jpg",
    postId: 1,
    url: "http://example.com/image.jpg",
    isMock: false,
  };

  const mockPage: Page<IPost> = {
    content: [mockPost],
    totalPages: 1,
    totalElements: 1,
    size: 10,
    number: 0,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup repository mock
    mockRepository = {
      getAll: vi.fn(),
      getById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      archive: vi.fn(),
    };

    // Setup image service mock
    mockImageService = {
      getPostImages: vi.fn(),
      getPostImageById: vi.fn(),
      createPostImage: vi.fn(),
      uploadPostImages: vi.fn(),
      deletePostImage: vi.fn(),
      deleteMultiplePostImages: vi.fn(),
    };

    // Configure mocks
    vi.mocked(PostRepository).mockImplementation(() => mockRepository);
    vi.mocked(PostImageService).mockImplementation(() => mockImageService);

    // Create service instance
    postService = new PostService();
  });

  describe("getAllPosts", () => {
    it("debería obtener todos los posts con paginación", async () => {
      // Arrange
      mockRepository.getAll.mockResolvedValue(mockPage);
      mockImageService.getPostImages.mockResolvedValue([mockPostImage]);

      // Act
      const result = await postService.getAllPosts(0, 10);

      // Assert
      expect(mockRepository.getAll).toHaveBeenCalledWith(0, 10);
      expect(result.content).toHaveLength(1);
      expect(result.totalElements).toBe(1);
    });

    it("debería usar valores por defecto para paginación", async () => {
      // Arrange
      mockRepository.getAll.mockResolvedValue(mockPage);
      mockImageService.getPostImages.mockResolvedValue([]);

      // Act
      await postService.getAllPosts();

      // Assert
      expect(mockRepository.getAll).toHaveBeenCalledWith(0, 10);
    });

    it("debería ordenar posts por ID descendente", async () => {
      // Arrange
      const posts = [
        { ...mockPost, id: 1 },
        { ...mockPost, id: 3 },
        { ...mockPost, id: 2 },
      ];
      const pageWithMultiplePosts = { ...mockPage, content: posts };
      mockRepository.getAll.mockResolvedValue(pageWithMultiplePosts);
      mockImageService.getPostImages.mockResolvedValue([]);

      // Act
      const result = await postService.getAllPosts();

      // Assert
      expect(result.content[0].id).toBe(3);
      expect(result.content[1].id).toBe(2);
      expect(result.content[2].id).toBe(1);
    });

    it("debería cargar imágenes reales para posts con imágenes mock", async () => {
      // Arrange
      const postWithMockImage = {
        ...mockPost,
        images: [{ isMock: true, url: "mock.jpg" }],
      };
      const pageWithMockImages = { ...mockPage, content: [postWithMockImage] };
      mockRepository.getAll.mockResolvedValue(pageWithMockImages);
      mockImageService.getPostImages.mockResolvedValue([mockPostImage]);

      // Act
      const result = await postService.getAllPosts();

      // Assert
      expect(mockImageService.getPostImages).toHaveBeenCalledWith(1);
      expect(result.content[0].images).toEqual([mockPostImage]);
    });

    it("debería cargar imágenes reales para posts con imágenes string", async () => {
      // Arrange
      const postWithStringImages = {
        ...mockPost,
        images: ["string-image.jpg"],
      };
      const pageWithStringImages = {
        ...mockPage,
        content: [postWithStringImages],
      };
      mockRepository.getAll.mockResolvedValue(pageWithStringImages);
      mockImageService.getPostImages.mockResolvedValue([mockPostImage]);

      // Act
      const result = await postService.getAllPosts();

      // Assert
      expect(mockImageService.getPostImages).toHaveBeenCalledWith(1);
      expect(result.content[0].images).toEqual([mockPostImage]);
    });

    it("debería manejar posts sin imágenes", async () => {
      // Arrange
      const postWithoutImages = { ...mockPost, images: [] };
      const pageWithoutImages = { ...mockPage, content: [postWithoutImages] };
      mockRepository.getAll.mockResolvedValue(pageWithoutImages);
      mockImageService.getPostImages.mockResolvedValue([]);

      // Act
      const result = await postService.getAllPosts();

      // Assert
      expect(mockImageService.getPostImages).toHaveBeenCalledWith(1);
      expect(result.content[0].images).toEqual([]);
    });

    it("debería manejar errores al cargar imágenes", async () => {
      // Arrange
      mockRepository.getAll.mockResolvedValue(mockPage);
      mockImageService.getPostImages.mockRejectedValue(
        new Error("Image service error")
      );

      // Act
      const result = await postService.getAllPosts();

      // Assert
      expect(result.content).toHaveLength(1);
      // No debería fallar por errores en imágenes
    });

    it("debería manejar página vacía", async () => {
      // Arrange
      const emptyPage = { ...mockPage, content: [], totalElements: 0 };
      mockRepository.getAll.mockResolvedValue(emptyPage);

      // Act
      const result = await postService.getAllPosts();

      // Assert
      expect(result.content).toHaveLength(0);
      expect(result.totalElements).toBe(0);
    });
  });

  describe("getPostById", () => {
    it("debería obtener un post por ID", async () => {
      // Arrange
      mockRepository.getById.mockResolvedValue(mockPost);
      mockImageService.getPostImages.mockResolvedValue([mockPostImage]);

      // Act
      const result = await postService.getPostById(1);

      // Assert
      expect(mockRepository.getById).toHaveBeenCalledWith(1);
      expect(result.id).toBe(1);
      expect(result.title).toBe("Test Post");
    });

    it("debería cargar imágenes reales para post individual", async () => {
      // Arrange
      const postWithMockImage = {
        ...mockPost,
        images: [{ isMock: true, url: "mock.jpg" }],
      };
      mockRepository.getById.mockResolvedValue(postWithMockImage);
      mockImageService.getPostImages.mockResolvedValue([mockPostImage]);

      // Act
      const result = await postService.getPostById(1);

      // Assert
      expect(mockImageService.getPostImages).toHaveBeenCalledWith(1);
      expect(result.images).toEqual([mockPostImage]);
    });

    it("debería manejar post no encontrado", async () => {
      // Arrange
      mockRepository.getById.mockRejectedValue(new Error("Post not found"));

      // Act & Assert
      await expect(postService.getPostById(999)).rejects.toThrow(
        "Post not found"
      );
    });

    it("debería manejar post con imágenes string", async () => {
      // Arrange
      const postWithStringImages = {
        ...mockPost,
        images: ["image1.jpg", "image2.jpg"],
      };
      mockRepository.getById.mockResolvedValue(postWithStringImages);
      mockImageService.getPostImages.mockResolvedValue([mockPostImage]);

      // Act
      const result = await postService.getPostById(1);

      // Assert
      expect(mockImageService.getPostImages).toHaveBeenCalledWith(1);
      expect(result.images).toEqual([mockPostImage]);
    });

    it("debería manejar errores al cargar imágenes de post individual", async () => {
      // Arrange
      mockRepository.getById.mockResolvedValue(mockPost);
      mockImageService.getPostImages.mockRejectedValue(
        new Error("Image error")
      );

      // Act
      const result = await postService.getPostById(1);

      // Assert
      expect(result.id).toBe(1);
      // No debería fallar por errores en imágenes
    });
  });

  describe("createPost", () => {
    it("debería crear un post correctamente", async () => {
      // Arrange
      const createdPost = { ...mockPost, ...mockPostDTO };
      mockRepository.create.mockResolvedValue(createdPost);

      // Act
      const result = await postService.createPost(mockPostDTO);

      // Assert
      expect(mockRepository.create).toHaveBeenCalledWith(mockPostDTO);
      expect(result.title).toBe(mockPostDTO.title);
      expect(result.message).toBe(mockPostDTO.message);
    });

    it("debería manejar error al crear post", async () => {
      // Arrange
      mockRepository.create.mockRejectedValue(new Error("Creation failed"));

      // Act & Assert
      await expect(postService.createPost(mockPostDTO)).rejects.toThrow(
        "Creation failed"
      );
    });

    it("debería crear post con tags", async () => {
      // Arrange
      const postWithTags = {
        ...mockPostDTO,
        tags: [{ id: 1, name: "important" }],
      };
      const createdPost = { ...mockPost, tags: ["important"] };
      mockRepository.create.mockResolvedValue(createdPost);

      // Act
      const result = await postService.createPost(postWithTags);

      // Assert
      expect(mockRepository.create).toHaveBeenCalledWith(postWithTags);
      expect(result.tags).toContain("important");
    });

    it("debería crear post sin imágenes", async () => {
      // Arrange
      const postWithoutImages = { ...mockPostDTO, images: [] };
      const createdPost = { ...mockPost, images: [] };
      mockRepository.create.mockResolvedValue(createdPost);

      // Act
      const result = await postService.createPost(postWithoutImages);

      // Assert
      expect(result.images).toEqual([]);
    });
  });

  describe("updatePost", () => {
    it("debería actualizar un post correctamente", async () => {
      // Arrange
      const updatedPost = { ...mockPost, title: "Updated Title" };
      mockRepository.update.mockResolvedValue(updatedPost);

      // Act
      const result = await postService.updatePost(1, mockPostDTO);

      // Assert
      expect(mockRepository.update).toHaveBeenCalledWith(1, mockPostDTO);
      expect(result.title).toBe("Updated Title");
    });

    it("debería manejar error al actualizar post", async () => {
      // Arrange
      mockRepository.update.mockRejectedValue(new Error("Update failed"));

      // Act & Assert
      await expect(postService.updatePost(1, mockPostDTO)).rejects.toThrow(
        "Update failed"
      );
    });

    it("debería actualizar post con nuevas tags", async () => {
      // Arrange
      const updatedDTO = { ...mockPostDTO, tags: [{ id: 2, name: "updated" }] };
      const updatedPost = { ...mockPost, tags: ["updated"] };
      mockRepository.update.mockResolvedValue(updatedPost);

      // Act
      const result = await postService.updatePost(1, updatedDTO);

      // Assert
      expect(result.tags).toContain("updated");
    });

    it("debería manejar post no encontrado en actualización", async () => {
      // Arrange
      mockRepository.update.mockRejectedValue(new Error("Post not found"));

      // Act & Assert
      await expect(postService.updatePost(999, mockPostDTO)).rejects.toThrow(
        "Post not found"
      );
    });
  });

  describe("deletePost", () => {
    it("debería eliminar un post correctamente", async () => {
      // Arrange
      mockRepository.delete.mockResolvedValue(undefined);

      // Act
      await postService.deletePost(mockPostDTO, 1);

      // Assert
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it("debería manejar error al eliminar post", async () => {
      // Arrange
      mockRepository.delete.mockRejectedValue(new Error("Delete failed"));

      // Act & Assert
      await expect(postService.deletePost(mockPostDTO, 1)).rejects.toThrow(
        "Delete failed"
      );
    });

    it("debería manejar post no encontrado en eliminación", async () => {
      // Arrange
      mockRepository.delete.mockRejectedValue(new Error("Post not found"));

      // Act & Assert
      await expect(postService.deletePost(mockPostDTO, 999)).rejects.toThrow(
        "Post not found"
      );
    });
  });

  describe("archivePost", () => {
    it("debería archivar un post correctamente", async () => {
      // Arrange
      mockRepository.archive.mockResolvedValue(undefined);

      // Act
      await postService.archivePost(1, true);

      // Assert
      expect(mockRepository.archive).toHaveBeenCalledWith(1, true);
    });

    it("debería desarchivar un post", async () => {
      // Arrange
      mockRepository.archive.mockResolvedValue(undefined);

      // Act
      await postService.archivePost(1, false);

      // Assert
      expect(mockRepository.archive).toHaveBeenCalledWith(1, false);
    });

    it("debería manejar error al archivar", async () => {
      // Arrange
      mockRepository.archive.mockRejectedValue(new Error("Archive failed"));

      // Act & Assert
      await expect(postService.archivePost(1, true)).rejects.toThrow(
        "Archive failed"
      );
    });
  });

  describe("unArchivePost", () => {
    it("debería desarchivar un post correctamente", async () => {
      // Arrange
      mockRepository.archive.mockResolvedValue(undefined);

      // Act
      await postService.unArchivePost(1);

      // Assert
      expect(mockRepository.archive).toHaveBeenCalledWith(1, false);
    });

    it("debería manejar error al desarchivar", async () => {
      // Arrange
      mockRepository.archive.mockRejectedValue(new Error("Unarchive failed"));

      // Act & Assert
      await expect(postService.unArchivePost(1)).rejects.toThrow(
        "Unarchive failed"
      );
    });
  });

  describe("image services", () => {
    describe("getPostImages", () => {
      it("debería obtener imágenes de un post", async () => {
        // Arrange
        mockImageService.getPostImages.mockResolvedValue([mockPostImage]);

        // Act
        const result = await postService.getPostImages(1);

        // Assert
        expect(mockImageService.getPostImages).toHaveBeenCalledWith(1);
        expect(result).toEqual([mockPostImage]);
      });

      it("debería manejar error al obtener imágenes", async () => {
        // Arrange
        mockImageService.getPostImages.mockRejectedValue(
          new Error("Images not found")
        );

        // Act & Assert
        await expect(postService.getPostImages(1)).rejects.toThrow(
          "Images not found"
        );
      });
    });

    describe("getPostImageById", () => {
      it("debería obtener una imagen por ID", async () => {
        // Arrange
        mockImageService.getPostImageById.mockResolvedValue(mockPostImage);

        // Act
        const result = await postService.getPostImageById(1);

        // Assert
        expect(mockImageService.getPostImageById).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockPostImage);
      });

      it("debería manejar imagen no encontrada", async () => {
        // Arrange
        mockImageService.getPostImageById.mockRejectedValue(
          new Error("Image not found")
        );

        // Act & Assert
        await expect(postService.getPostImageById(999)).rejects.toThrow(
          "Image not found"
        );
      });
    });

    describe("createPostImage", () => {
      it("debería crear una imagen de post", async () => {
        // Arrange
        const imageData = { imageName: "new-image.jpg", postId: 1 };
        mockImageService.createPostImage.mockResolvedValue(mockPostImage);

        // Act
        const result = await postService.createPostImage(imageData);

        // Assert
        expect(mockImageService.createPostImage).toHaveBeenCalledWith(
          imageData
        );
        expect(result).toEqual(mockPostImage);
      });

      it("debería manejar error al crear imagen", async () => {
        // Arrange
        mockImageService.createPostImage.mockRejectedValue(
          new Error("Creation failed")
        );

        // Act & Assert
        await expect(postService.createPostImage({})).rejects.toThrow(
          "Creation failed"
        );
      });
    });

    describe("uploadPostImages", () => {
      it("debería subir múltiples imágenes", async () => {
        // Arrange
        const files = [
          new File([""], "image1.jpg"),
          new File([""], "image2.jpg"),
        ];
        const images = [mockPostImage, { ...mockPostImage, id: 2 }];
        mockImageService.uploadPostImages.mockResolvedValue(images);

        // Act
        const result = await postService.uploadPostImages(1, files);

        // Assert
        expect(mockImageService.uploadPostImages).toHaveBeenCalledWith(
          1,
          files
        );
        expect(result).toEqual(images);
        expect(result).toHaveLength(2);
      });

      it("debería manejar error al subir imágenes", async () => {
        // Arrange
        const files = [new File([""], "image.jpg")];
        mockImageService.uploadPostImages.mockRejectedValue(
          new Error("Upload failed")
        );

        // Act & Assert
        await expect(postService.uploadPostImages(1, files)).rejects.toThrow(
          "Upload failed"
        );
      });
    });

    describe("updatePostImage", () => {
      it("debería actualizar una imagen de post", async () => {
        // Arrange
        const imageData = { imageName: "updated-image.jpg" };
        const updatedImage = {
          ...mockPostImage,
          imageName: "updated-image.jpg",
        };
        mockImageService.createPostImage.mockResolvedValue(updatedImage);

        // Act
        const result = await postService.updatePostImage(1, imageData);

        // Assert
        expect(mockImageService.createPostImage).toHaveBeenCalledWith({
          id: 1,
          ...imageData,
        });
        expect(result.imageName).toBe("updated-image.jpg");
      });

      it("debería manejar error al actualizar imagen", async () => {
        // Arrange
        mockImageService.createPostImage.mockRejectedValue(
          new Error("Update failed")
        );

        // Act & Assert
        await expect(postService.updatePostImage(1, {})).rejects.toThrow(
          "Update failed"
        );
      });
    });

    describe("deletePostImage", () => {
      it("debería eliminar una imagen de post", async () => {
        // Arrange
        mockImageService.deletePostImage.mockResolvedValue(undefined);

        // Act
        await postService.deletePostImage(1);

        // Assert
        expect(mockImageService.deletePostImage).toHaveBeenCalledWith(1);
      });

      it("debería manejar error al eliminar imagen", async () => {
        // Arrange
        mockImageService.deletePostImage.mockRejectedValue(
          new Error("Delete failed")
        );

        // Act & Assert
        await expect(postService.deletePostImage(1)).rejects.toThrow(
          "Delete failed"
        );
      });
    });

    describe("deleteMultiplePostImages", () => {
      it("debería eliminar múltiples imágenes", async () => {
        // Arrange
        const imageIds = [1, 2, 3];
        mockImageService.deleteMultiplePostImages.mockResolvedValue(undefined);

        // Act
        await postService.deleteMultiplePostImages(imageIds);

        // Assert
        expect(mockImageService.deleteMultiplePostImages).toHaveBeenCalledWith(
          imageIds
        );
      });

      it("debería manejar error al eliminar múltiples imágenes", async () => {
        // Arrange
        const imageIds = [1, 2, 3];
        mockImageService.deleteMultiplePostImages.mockRejectedValue(
          new Error("Delete failed")
        );

        // Act & Assert
        await expect(
          postService.deleteMultiplePostImages(imageIds)
        ).rejects.toThrow("Delete failed");
      });

      it("debería manejar array vacío de IDs", async () => {
        // Arrange
        mockImageService.deleteMultiplePostImages.mockResolvedValue(undefined);

        // Act
        await postService.deleteMultiplePostImages([]);

        // Assert
        expect(mockImageService.deleteMultiplePostImages).toHaveBeenCalledWith(
          []
        );
      });
    });
  });

  describe("edge cases", () => {
    it("debería manejar posts con campos adicionales", async () => {
      // Arrange
      const postWithExtraFields = {
        ...mockPost,
        extraField: "extra value",
        anotherField: 123,
      };
      mockRepository.getById.mockResolvedValue(postWithExtraFields);
      mockImageService.getPostImages.mockResolvedValue([]);

      // Act
      const result = await postService.getPostById(1);

      // Assert
      expect(result.extraField).toBe("extra value");
      expect(result.anotherField).toBe(123);
    });

    it("debería manejar posts con diferentes tipos de imágenes", async () => {
      // Arrange
      const postWithMixedImages = {
        ...mockPost,
        images: [
          "string-image.jpg",
          { id: 1, imageName: "object-image.jpg", isMock: false },
          { id: 2, imageName: "mock-image.jpg", isMock: true },
        ],
      };
      mockRepository.getById.mockResolvedValue(postWithMixedImages);
      mockImageService.getPostImages.mockResolvedValue([mockPostImage]);

      // Act
      const result = await postService.getPostById(1);

      // Assert
      expect(mockImageService.getPostImages).toHaveBeenCalledWith(1);
      expect(result.images).toEqual([mockPostImage]);
    });

    it("debería manejar errores de conexión", async () => {
      // Arrange
      mockRepository.getAll.mockRejectedValue(new Error("Network error"));

      // Act & Assert
      await expect(postService.getAllPosts()).rejects.toThrow("Network error");
    });

    it("debería manejar datos de paginación inválidos", async () => {
      // Arrange
      mockRepository.getAll.mockResolvedValue(mockPage);
      mockImageService.getPostImages.mockResolvedValue([]);

      // Act
      const result = await postService.getAllPosts(-1, 0);

      // Assert
      expect(mockRepository.getAll).toHaveBeenCalledWith(-1, 0);
      expect(result).toBeDefined();
    });

    it("debería preservar metadatos de paginación", async () => {
      // Arrange
      const complexPage = {
        ...mockPage,
        totalPages: 5,
        totalElements: 50,
        size: 10,
        number: 0,
      };
      mockRepository.getAll.mockResolvedValue(complexPage);
      mockImageService.getPostImages.mockResolvedValue([]);

      // Act
      const result = await postService.getAllPosts();

      // Assert
      expect(result.totalPages).toBe(5);
      expect(result.totalElements).toBe(50);
      expect(result.size).toBe(10);
      expect(result.number).toBe(0);
    });
  });
});
