import { describe, expect, it } from "vitest";
import avatarsReducer, {
  clearUploadError,
  deleteCustomAvatar,
  fetchAvatarById,
  fetchAvatarsForSelector,
  fetchDefaultAvatar,
  selectAvatar,
  uploadCustomAvatar,
} from "../../../core/avatars/avatarStore";
import IAvatar from "../../../core/avatars/IAvatar";

describe("avatarStore", () => {
  const mockAvatar: IAvatar = {
    id: 1,
    name: "avatar1",
    imagePath: "/avatars/avatar1.png",
    isCustom: false,
    isDefault: false,
  };

  const mockAvatar2: IAvatar = {
    id: 2,
    name: "avatar2",
    imagePath: "/avatars/avatar2.png",
    isCustom: false,
    isDefault: true,
  };

  describe("Initial State", () => {
    it("should return initial state", () => {
      const state = avatarsReducer(undefined, { type: "@@INIT" });
      expect(state).toEqual({
        avatars: [],
        defaultAvatar: null,
        selectedAvatar: null,
        isLoaded: false,
        isUploading: false,
        uploadError: null,
      });
    });
  });

  describe("fetchAvatarsForSelector", () => {
    it("should handle fulfilled state", () => {
      const avatars = [mockAvatar, mockAvatar2];
      const action = {
        type: fetchAvatarsForSelector.fulfilled.type,
        payload: avatars,
      };
      const state = avatarsReducer(undefined, action);

      expect(state.avatars).toEqual(avatars);
      expect(state.isLoaded).toBe(true);
    });

    it("should handle rejected state", () => {
      const action = { type: fetchAvatarsForSelector.rejected.type };
      const state = avatarsReducer(undefined, action);

      expect(state.isLoaded).toBe(true);
      expect(state.avatars).toEqual([]);
    });
  });

  describe("fetchDefaultAvatar", () => {
    it("should handle fulfilled state", () => {
      const action = {
        type: fetchDefaultAvatar.fulfilled.type,
        payload: mockAvatar2,
      };
      const state = avatarsReducer(undefined, action);

      expect(state.defaultAvatar).toEqual(mockAvatar2);
    });
  });

  describe("fetchAvatarById", () => {
    it("should add new avatar if not exists", () => {
      const action = {
        type: fetchAvatarById.fulfilled.type,
        payload: mockAvatar,
      };
      const state = avatarsReducer(undefined, action);

      expect(state.avatars).toHaveLength(1);
      expect(state.avatars[0]).toEqual(mockAvatar);
    });

    it("should update existing avatar", () => {
      const initialState = {
        avatars: [mockAvatar],
        defaultAvatar: null,
        selectedAvatar: null,
        isLoaded: false,
        isUploading: false,
        uploadError: null,
      };

      const updatedAvatar = { ...mockAvatar, name: "Updated Avatar" };
      const action = {
        type: fetchAvatarById.fulfilled.type,
        payload: updatedAvatar,
      };
      const state = avatarsReducer(initialState, action);

      expect(state.avatars).toHaveLength(1);
      expect(state.avatars[0].name).toBe("Updated Avatar");
    });
  });

  describe("uploadCustomAvatar", () => {
    it("should handle pending state", () => {
      const action = { type: uploadCustomAvatar.pending.type };
      const state = avatarsReducer(undefined, action);

      expect(state.isUploading).toBe(true);
      expect(state.uploadError).toBeNull();
    });

    it("should handle fulfilled state", () => {
      const customAvatar: IAvatar = {
        ...mockAvatar,
        id: 3,
        isCustom: true,
      };

      const action = {
        type: uploadCustomAvatar.fulfilled.type,
        payload: customAvatar,
      };
      const state = avatarsReducer(undefined, action);

      expect(state.avatars).toContain(customAvatar);
      expect(state.isUploading).toBe(false);
      expect(state.uploadError).toBeNull();
    });

    it("should handle rejected state", () => {
      const action = {
        type: uploadCustomAvatar.rejected.type,
        error: { message: "Upload failed" },
      };
      const state = avatarsReducer(undefined, action);

      expect(state.isUploading).toBe(false);
      expect(state.uploadError).toBe("Upload failed");
    });
  });

  describe("deleteCustomAvatar", () => {
    it("should remove avatar from list", () => {
      const initialState = {
        avatars: [mockAvatar, mockAvatar2],
        defaultAvatar: null,
        selectedAvatar: null,
        isLoaded: true,
        isUploading: false,
        uploadError: null,
      };

      const action = {
        type: deleteCustomAvatar.fulfilled.type,
        payload: 1,
      };
      const state = avatarsReducer(initialState, action);

      expect(state.avatars).toHaveLength(1);
      expect(state.avatars[0].id).toBe(2);
    });

    it("should clear selectedAvatar if deleted", () => {
      const initialState = {
        avatars: [mockAvatar],
        defaultAvatar: null,
        selectedAvatar: mockAvatar,
        isLoaded: true,
        isUploading: false,
        uploadError: null,
      };

      const action = {
        type: deleteCustomAvatar.fulfilled.type,
        payload: 1,
      };
      const state = avatarsReducer(initialState, action);

      expect(state.selectedAvatar).toBeNull();
    });
  });

  describe("Reducer Actions", () => {
    it("should select avatar", () => {
      const state = avatarsReducer(undefined, selectAvatar(mockAvatar));

      expect(state.selectedAvatar).toEqual(mockAvatar);
    });

    it("should clear upload error", () => {
      const initialState = {
        avatars: [],
        defaultAvatar: null,
        selectedAvatar: null,
        isLoaded: false,
        isUploading: false,
        uploadError: "Some error",
      };

      const state = avatarsReducer(initialState, clearUploadError());

      expect(state.uploadError).toBeNull();
    });
  });
});
