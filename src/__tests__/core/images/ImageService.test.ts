import { beforeEach, describe, expect, it, vi } from "vitest";
import { IImage } from "../../../core/images/IImage";
import { ImageRepository } from "../../../core/images/ImageRepository";
import ImageService from "../../../core/images/ImageService";

vi.mock("../../../core/images/ImageRepository");

describe("ImageService", () => {
  let imageService: ImageService;
  let mockRepository: ImageRepository;

  const mockImages: IImage[] = [
    {
      imageName: "image1.jpg",
      mainImage: true,
      url: "http://example.com/1.jpg",
    },
    {
      imageName: "image2.png",
      mainImage: false,
      url: "http://example.com/2.png",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockRepository = new ImageRepository();
    imageService = new ImageService(mockRepository);
  });

  describe("getAllImages", () => {
    it("should return all images from repository", async () => {
      vi.spyOn(mockRepository, "getAll").mockResolvedValue(mockImages);

      const result = await imageService.getAllImages();

      expect(result).toEqual(mockImages);
      expect(mockRepository.getAll).toHaveBeenCalledTimes(1);
    });

    it("should return empty array when no images exist", async () => {
      vi.spyOn(mockRepository, "getAll").mockResolvedValue([]);

      const result = await imageService.getAllImages();

      expect(result).toEqual([]);
    });

    it("should throw error when repository fails", async () => {
      vi.spyOn(mockRepository, "getAll").mockRejectedValue(
        new Error("Repository error")
      );

      await expect(imageService.getAllImages()).rejects.toThrow(
        "Repository error"
      );
    });
  });

  describe("uploadImages", () => {
    it("should upload images successfully", async () => {
      const formData = new FormData();
      formData.append("images", new Blob(["image1"]), "image1.jpg");

      vi.spyOn(mockRepository, "upload").mockResolvedValue(mockImages);

      const result = await imageService.uploadImages(formData);

      expect(result).toEqual(mockImages);
      expect(mockRepository.upload).toHaveBeenCalledWith(formData);
      expect(mockRepository.upload).toHaveBeenCalledTimes(1);
    });

    it("should handle empty FormData", async () => {
      const emptyFormData = new FormData();
      vi.spyOn(mockRepository, "upload").mockResolvedValue([]);

      const result = await imageService.uploadImages(emptyFormData);

      expect(result).toEqual([]);
    });

    it("should throw error when upload fails", async () => {
      const formData = new FormData();
      vi.spyOn(mockRepository, "upload").mockRejectedValue(
        new Error("Upload failed")
      );

      await expect(imageService.uploadImages(formData)).rejects.toThrow(
        "Upload failed"
      );
    });
  });

  describe("deleteImage", () => {
    it("should delete image successfully", async () => {
      vi.spyOn(mockRepository, "delete").mockResolvedValue(undefined);

      await imageService.deleteImage("image1.jpg");

      expect(mockRepository.delete).toHaveBeenCalledWith("image1.jpg");
      expect(mockRepository.delete).toHaveBeenCalledTimes(1);
    });

    it("should handle deleting non-existent image", async () => {
      vi.spyOn(mockRepository, "delete").mockRejectedValue(
        new Error("Image not found")
      );

      await expect(imageService.deleteImage("nonexistent.jpg")).rejects.toThrow(
        "Image not found"
      );
    });

    it("should throw error when deletion fails", async () => {
      vi.spyOn(mockRepository, "delete").mockRejectedValue(
        new Error("Deletion failed")
      );

      await expect(imageService.deleteImage("image.jpg")).rejects.toThrow(
        "Deletion failed"
      );
    });
  });

  describe("constructor", () => {
    it("should use provided repository", () => {
      const customRepo = new ImageRepository();
      const service = new ImageService(customRepo);

      expect(service).toBeInstanceOf(ImageService);
    });

    it("should create default repository when none provided", () => {
      const service = new ImageService();

      expect(service).toBeInstanceOf(ImageService);
    });
  });
});
