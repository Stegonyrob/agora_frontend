import { describe, it, expect } from "vitest";
import legalTextsReducer, {
  fetchLegalTexts,
} from "../../../core/legals/legalTextStore";
import { ILegalText } from "../../../core/legals/ILegalText";

describe("legalTextStore", () => {
  const mockLegalText: ILegalText = {
    id: 1,
    type: "privacy",
    title: "Privacy Policy",
    content: "Privacy policy content",
    updatedAt: new Date().toISOString(),
  };

  describe("Initial State", () => {
    it("should return initial state", () => {
      const state = legalTextsReducer(undefined, { type: "@@INIT" });
      expect(state).toEqual({
        legalTexts: [],
        isLoaded: false,
      });
    });
  });

  describe("fetchLegalTexts", () => {
    it("should handle fetchLegalTexts.fulfilled", () => {
      const legalTexts = [mockLegalText];
      const action = { type: fetchLegalTexts.fulfilled.type, payload: legalTexts };
      const state = legalTextsReducer(undefined, action);

      expect(state.legalTexts).toEqual(legalTexts);
      expect(state.isLoaded).toBe(true);
    });

    it("should handle empty legal texts array", () => {
      const action = { type: fetchLegalTexts.fulfilled.type, payload: [] };
      const state = legalTextsReducer(undefined, action);

      expect(state.legalTexts).toEqual([]);
      expect(state.isLoaded).toBe(true);
    });

    it("should replace existing legal texts", () => {
      const initialState = {
        legalTexts: [mockLegalText],
        isLoaded: true,
      };

      const newLegalText: ILegalText = {
        id: 2,
        type: "terms",
        title: "Terms of Service",
        content: "Terms content",
        updatedAt: new Date().toISOString(),
      };

      const action = {
        type: fetchLegalTexts.fulfilled.type,
        payload: [newLegalText],
      };
      const state = legalTextsReducer(initialState, action);

      expect(state.legalTexts).toEqual([newLegalText]);
      expect(state.legalTexts).toHaveLength(1);
    });
  });
});
