import { describe, expect, it } from "vitest";
import { IText } from "../../../core/texts/IText";
import textsReducer, {
  createText,
  deleteText,
  fetchTexts,
  updateText,
} from "../../../core/texts/textStore";

describe("textStore", () => {
  const mockText: IText = {
    id: 1,
    title: "Test Text",
    message: "Test content",
    category: "general",
    name_image: "test-image.jpg",
    createdAt: new Date().toISOString(),
    images: [],
    archived: false,
  };

  describe("Initial State", () => {
    it("should return initial state", () => {
      const state = textsReducer(undefined, { type: "@@INIT" });
      expect(state).toEqual({
        texts: [],
        isLoaded: false,
      });
    });
  });

  describe("fetchTexts", () => {
    it("should handle fetchTexts.fulfilled", () => {
      const texts = [mockText];
      const action = { type: fetchTexts.fulfilled.type, payload: texts };
      const state = textsReducer(undefined, action);

      expect(state.texts).toEqual(texts);
      expect(state.isLoaded).toBe(true);
    });
  });

  describe("createText", () => {
    it("should handle createText.fulfilled", () => {
      const initialState = {
        texts: [mockText],
        isLoaded: true,
      };

      const newText: IText = {
        ...mockText,
        id: 2,
        title: "New Text",
      };

      const action = { type: createText.fulfilled.type, payload: newText };
      const state = textsReducer(initialState, action);

      expect(state.texts).toHaveLength(2);
      expect(state.texts[1]).toEqual(newText);
    });
  });

  describe("updateText", () => {
    it("should handle updateText.fulfilled", () => {
      const initialState = {
        texts: [mockText],
        isLoaded: true,
      };

      const updatedText: IText = {
        ...mockText,
        title: "Updated Title",
      };

      const action = { type: updateText.fulfilled.type, payload: updatedText };
      const state = textsReducer(initialState, action);

      expect(state.texts[0].title).toBe("Updated Title");
    });

    it("should not update if text not found", () => {
      const initialState = {
        texts: [mockText],
        isLoaded: true,
      };

      const action = {
        type: updateText.fulfilled.type,
        payload: { id: 999, title: "Not found" },
      };
      const state = textsReducer(initialState, action);

      expect(state.texts).toEqual([mockText]);
    });
  });

  describe("deleteText", () => {
    it("should handle deleteText.fulfilled", () => {
      const text2: IText = {
        ...mockText,
        id: 2,
        title: "Text 2",
      };

      const initialState = {
        texts: [mockText, text2],
        isLoaded: true,
      };

      const action = { type: deleteText.fulfilled.type, payload: 1 };
      const state = textsReducer(initialState, action);

      expect(state.texts).toHaveLength(1);
      expect(state.texts[0].id).toBe(2);
    });

    it("should handle deleting non-existent text", () => {
      const initialState = {
        texts: [mockText],
        isLoaded: true,
      };

      const action = { type: deleteText.fulfilled.type, payload: 999 };
      const state = textsReducer(initialState, action);

      expect(state.texts).toEqual([mockText]);
    });
  });
});
