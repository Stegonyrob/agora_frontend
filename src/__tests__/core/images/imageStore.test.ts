import { describe, expect, it } from "vitest";
import { IImage } from "../../../core/images/IImage";
import imagesReducer, {
  addImages,
  removeImage,
  resetImages,
  setImages,
} from "../../../core/images/imageStore";

describe("imageStore", () => {
  const mockImage1: IImage = {
    imageName: "image1.jpg",
    mainImage: true,
    url: "https://example.com/image1.jpg",
    size: 1024,
  };

  const mockImage2: IImage = {
    imageName: "image2.jpg",
    mainImage: false,
    url: "https://example.com/image2.jpg",
    size: 2048,
  };

  describe("Initial State", () => {
    it("should return initial state", () => {
      const state = imagesReducer(undefined, { type: "@@INIT" });
      expect(state).toEqual({
        images: [],
        mainImageUrl: "/images/placeholder-image.svg",
      });
    });
  });

  describe("setImages", () => {
    it("should set images and update mainImageUrl", () => {
      const state = imagesReducer(
        undefined,
        setImages([mockImage1, mockImage2])
      );

      expect(state.images).toHaveLength(2);
      expect(state.images[0]).toEqual(mockImage1);
      expect(state.mainImageUrl).toBe("https://example.com/image1.jpg");
    });

    it("should handle empty array", () => {
      const state = imagesReducer(undefined, setImages([]));

      expect(state.images).toEqual([]);
      expect(state.mainImageUrl).toBe("/images/placeholder-image.svg");
    });

    it("should use placeholder if image has no url", () => {
      const imageWithoutUrl: IImage = {
        imageName: "no-url.jpg",
        mainImage: true,
        url: "",
        size: 512,
      };

      const state = imagesReducer(undefined, setImages([imageWithoutUrl]));

      expect(state.mainImageUrl).toBe("/images/placeholder-image.svg");
    });
  });

  describe("addImages", () => {
    it("should add images to existing state", () => {
      const initialState = {
        images: [mockImage1],
        mainImageUrl: "https://example.com/image1.jpg",
      };

      const state = imagesReducer(initialState, addImages([mockImage2]));

      expect(state.images).toHaveLength(2);
      expect(state.images[1]).toEqual(mockImage2);
    });

    it("should update mainImageUrl if previously empty", () => {
      const initialState = {
        images: [],
        mainImageUrl: "/images/placeholder-image.svg",
      };

      const state = imagesReducer(initialState, addImages([mockImage1]));

      expect(state.mainImageUrl).toBe("https://example.com/image1.jpg");
    });
  });

  describe("removeImage", () => {
    it("should remove image by imageName", () => {
      const initialState = {
        images: [mockImage1, mockImage2],
        mainImageUrl: "https://example.com/image1.jpg",
      };

      const state = imagesReducer(initialState, removeImage("image1.jpg"));

      expect(state.images).toHaveLength(1);
      expect(state.images[0]).toEqual(mockImage2);
      expect(state.mainImageUrl).toBe("https://example.com/image2.jpg");
    });

    it("should set placeholder when all images removed", () => {
      const initialState = {
        images: [mockImage1],
        mainImageUrl: "https://example.com/image1.jpg",
      };

      const state = imagesReducer(initialState, removeImage("image1.jpg"));

      expect(state.images).toHaveLength(0);
      expect(state.mainImageUrl).toBe("/images/placeholder-image.svg");
    });

    it("should not modify state if image not found", () => {
      const initialState = {
        images: [mockImage1],
        mainImageUrl: "https://example.com/image1.jpg",
      };

      const state = imagesReducer(
        initialState,
        removeImage("non-existent.jpg")
      );

      expect(state.images).toEqual([mockImage1]);
    });
  });

  describe("resetImages", () => {
    it("should reset to initial state", () => {
      const initialState = {
        images: [mockImage1, mockImage2],
        mainImageUrl: "https://example.com/image1.jpg",
      };

      const state = imagesReducer(initialState, resetImages());

      expect(state.images).toEqual([]);
      expect(state.mainImageUrl).toBe("/images/placeholder-image.svg");
    });
  });
});
