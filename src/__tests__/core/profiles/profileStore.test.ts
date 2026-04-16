import IProfile from "@/core/profiles/IProfile";
import profileReducer, {
  createProfile,
  deleteProfile,
  fetchProfileById,
  fetchProfiles,
  updateProfile,
} from "@/core/profiles/profileStore";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the ProfileService
vi.mock("@/core/profiles/ProfileService", () => ({
  default: vi.fn().mockImplementation(() => ({
    getAllProfiles: vi.fn(),
    getProfileById: vi.fn(),
    createProfile: vi.fn(),
    updateProfile: vi.fn(),
    deleteProfile: vi.fn(),
  })),
}));

describe("profileStore", () => {
  const mockProfile: IProfile = {
    id: 1,
    firstName: "Test",
    lastName1: "User",
    lastName2: "",
    relationship: "single",
    email: "test@example.com",
    avatar: "avatar1.png",
    city: "Madrid",
    country: "Spain",
    phone: "123456789",
    password: "password123",
    confirmPassword: "password123",
  };

  const mockProfile2: IProfile = {
    id: 2,
    firstName: "Test2",
    lastName1: "User2",
    lastName2: "",
    relationship: "single",
    email: "test2@example.com",
    avatar: "avatar2.png",
    city: "Barcelona",
    country: "Spain",
    phone: "987654321",
    password: "password456",
    confirmPassword: "password456",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("should return the initial state", () => {
      const state = profileReducer(undefined, { type: "@@INIT" });
      expect(state).toEqual({
        profiles: [],
        isLoaded: false,
      });
    });
  });

  describe("fetchProfiles", () => {
    it("should handle fetchProfiles.fulfilled", () => {
      const action = {
        type: fetchProfiles.fulfilled.type,
        payload: [mockProfile, mockProfile2],
      };
      const state = profileReducer(undefined, action);
      expect(state.profiles).toHaveLength(2);
      expect(state.profiles[0]).toEqual(mockProfile);
      expect(state.profiles[1]).toEqual(mockProfile2);
      expect(state.isLoaded).toBe(true);
    });

    it("should handle empty profiles array", () => {
      const action = {
        type: fetchProfiles.fulfilled.type,
        payload: [],
      };
      const state = profileReducer(undefined, action);
      expect(state.profiles).toEqual([]);
      expect(state.isLoaded).toBe(true);
    });
  });

  describe("fetchProfileById", () => {
    it("should add a new profile when not found", () => {
      const initialState = {
        profiles: [mockProfile],
        isLoaded: true,
      };
      const action = {
        type: fetchProfileById.fulfilled.type,
        payload: mockProfile2,
      };
      const state = profileReducer(initialState, action);
      expect(state.profiles).toHaveLength(2);
      expect(state.profiles[1]).toEqual(mockProfile2);
    });

    it("should update an existing profile when found", () => {
      const initialState = {
        profiles: [mockProfile],
        isLoaded: true,
      };
      const updatedProfile = {
        ...mockProfile,
        firstName: "Updated",
      };
      const action = {
        type: fetchProfileById.fulfilled.type,
        payload: updatedProfile,
      };
      const state = profileReducer(initialState, action);
      expect(state.profiles).toHaveLength(1);
      expect(state.profiles[0].firstName).toBe("Updated");
    });
  });

  describe("createProfile", () => {
    it("should add a new profile to the state", () => {
      const initialState = {
        profiles: [mockProfile],
        isLoaded: true,
      };
      const action = {
        type: createProfile.fulfilled.type,
        payload: mockProfile2,
      };
      const state = profileReducer(initialState, action);
      expect(state.profiles).toHaveLength(2);
      expect(state.profiles[1]).toEqual(mockProfile2);
    });
  });

  describe("updateProfile", () => {
    it("should update an existing profile", () => {
      const initialState = {
        profiles: [mockProfile, mockProfile2],
        isLoaded: true,
      };
      const updatedProfile = {
        ...mockProfile,
        firstName: "Updated",
        avatar: "newavatar.png",
      };
      const action = {
        type: updateProfile.fulfilled.type,
        payload: updatedProfile,
      };
      const state = profileReducer(initialState, action);
      expect(state.profiles).toHaveLength(2);
      expect(state.profiles[0].firstName).toBe("Updated");
      expect(state.profiles[0].avatar).toBe("newavatar.png");
    });

    it("should not change state if profile not found", () => {
      const initialState = {
        profiles: [mockProfile],
        isLoaded: true,
      };
      const nonExistentProfile = {
        ...mockProfile2,
        id: 999,
      };
      const action = {
        type: updateProfile.fulfilled.type,
        payload: nonExistentProfile,
      };
      const state = profileReducer(initialState, action);
      expect(state.profiles).toHaveLength(1);
      expect(state.profiles[0]).toEqual(mockProfile);
    });
  });

  describe("deleteProfile", () => {
    it("should remove the profile from state", () => {
      const initialState = {
        profiles: [mockProfile, mockProfile2],
        isLoaded: true,
      };
      const action = {
        type: deleteProfile.fulfilled.type,
        payload: 1,
      };
      const state = profileReducer(initialState, action);
      expect(state.profiles).toHaveLength(1);
      expect(state.profiles[0].id).toBe(2);
    });

    it("should not change state if profile not found", () => {
      const initialState = {
        profiles: [mockProfile],
        isLoaded: true,
      };
      const action = {
        type: deleteProfile.fulfilled.type,
        payload: 999,
      };
      const state = profileReducer(initialState, action);
      expect(state.profiles).toHaveLength(1);
      expect(state.profiles[0]).toEqual(mockProfile);
    });
  });
});
