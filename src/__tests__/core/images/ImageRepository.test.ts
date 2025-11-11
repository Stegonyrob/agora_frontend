import axios from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as AuthHeaders from "../../../core/auth/AuthHeaders";
import { IImage } from "../../../core/images/IImage";
import { ImageRepository } from "../../../core/images/ImageRepository";

vi.mock("axios");
vi.mock("../../../core/auth/AuthHeaders");

describe("ImageRepository", () => {
  let repository: ImageRepository;
  const mockUri = "http://localhost:8080/api/v1/images";
  const consoleErrorSpy = vi
    .spyOn(console, "error")
    .mockImplementation(() => {});

  const mockImages = [
    { imageName: "image1.jpg", imageUrl: "http://example.com/1.jpg" },
    { imageName: "image2.png", imageUrl: "http://example.com/2.png" },
  ] as unknown as IImage[];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("VITE_API_ENDPOINT_IMAGES", mockUri);
    vi.spyOn(AuthHeaders, "getAuthHeaders").mockReturnValue({
      Authorization: "Bearer token",
    });
    repository = new ImageRepository();
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.unstubAllEnvs();
    consoleErrorSpy.mockClear();
  });

  describe("getAll", () => {
    it("should retrieve all images successfully", async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: mockImages });

      const result = await repository.getAll();

      expect(result).toEqual(mockImages);
      expect(axios.get).toHaveBeenCalledWith(mockUri, {
        headers: { Authorization: "Bearer token" },
      });
    });

    it("should return empty array when no images exist", async () => {
      vi.mocked(axios.get).mockResolvedValue({ data: [] });

      const result = await repository.getAll();

      expect(result).toEqual([]);
    });

    it("should throw error when request fails", async () => {
      vi.mocked(axios.get).mockRejectedValue(new Error("Network error"));

      await expect(repository.getAll()).rejects.toThrow("Network error");
    });
  });

  describe("upload", () => {
    it("should upload images successfully", async () => {
      const formData = new FormData();
      formData.append("images", new Blob(["image1"]), "image1.jpg");

      vi.mocked(axios.post).mockResolvedValue({ data: mockImages });

      const result = await repository.upload(formData);

      expect(result).toEqual(mockImages);
      expect(axios.post).toHaveBeenCalledWith(mockUri, formData, {
        headers: { Authorization: "Bearer token" },
      });
    });

    it("should handle multiple image upload", async () => {
      const formData = new FormData();
      formData.append("images", new Blob(["image1"]), "image1.jpg");
      formData.append("images", new Blob(["image2"]), "image2.png");

      vi.mocked(axios.post).mockResolvedValue({ data: mockImages });

      const result = await repository.upload(formData);

      expect(result).toHaveLength(2);
    });

    it("should throw error when upload fails", async () => {
      const formData = new FormData();
      vi.mocked(axios.post).mockRejectedValue(new Error("Upload failed"));

      await expect(repository.upload(formData)).rejects.toThrow(
        "Upload failed"
      );
    });

    it("should include authorization headers", async () => {
      const formData = new FormData();
      vi.mocked(axios.post).mockResolvedValue({ data: [] });

      await repository.upload(formData);

      expect(axios.post).toHaveBeenCalledWith(
        mockUri,
        formData,
        expect.objectContaining({
          headers: { Authorization: "Bearer token" },
        })
      );
    });
  });

  describe("delete", () => {
    it("should delete image successfully", async () => {
      vi.mocked(axios.delete).mockResolvedValue({ data: null });

      await repository.delete("image1.jpg");

      expect(axios.delete).toHaveBeenCalledWith(`${mockUri}/image1.jpg`, {
        headers: { Authorization: "Bearer token" },
      });
    });

    it("should handle image deletion with special characters in name", async () => {
      vi.mocked(axios.delete).mockResolvedValue({ data: null });

      await repository.delete("image-with-dash_123.jpg");

      expect(axios.delete).toHaveBeenCalledWith(
        `${mockUri}/image-with-dash_123.jpg`,
        {
          headers: { Authorization: "Bearer token" },
        }
      );
    });

    it("should throw error when deletion fails", async () => {
      vi.mocked(axios.delete).mockRejectedValue(new Error("Deletion failed"));

      await expect(repository.delete("image.jpg")).rejects.toThrow(
        "Deletion failed"
      );
    });

    it("should throw error when image not found", async () => {
      vi.mocked(axios.delete).mockRejectedValue({ response: { status: 404 } });

      await expect(repository.delete("nonexistent.jpg")).rejects.toEqual({
        response: { status: 404 },
      });
    });
  });
});
