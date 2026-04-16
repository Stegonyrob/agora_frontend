import { describe, expect, it, vi } from "vitest";
import {
  getAvatarList,
  getAvatarNameBySrc,
  getAvatarUrlByUserId,
  getRandomDefaultAvatar,
} from "../../utils/avatarUtils";

describe("avatarUtils", () => {
  describe("getRandomDefaultAvatar", () => {
    it("returns a string that starts with /images/avatars/", () => {
      const avatar = getRandomDefaultAvatar();
      expect(avatar).toMatch(/^\/images\/avatars\/\d+\.png$/);
    });

    it("returns different avatars on multiple calls (eventually)", () => {
      // Mock Math.random to test different outcomes
      const originalRandom = Math.random;

      Math.random = vi
        .fn()
        .mockReturnValueOnce(0) // First avatar
        .mockReturnValueOnce(0.5) // Middle avatar
        .mockReturnValueOnce(0.99); // Last avatar

      const avatar1 = getRandomDefaultAvatar();
      const avatar2 = getRandomDefaultAvatar();
      const avatar3 = getRandomDefaultAvatar();

      expect(avatar1).toBe("/images/avatars/1.png");
      expect(avatar2).toBe("/images/avatars/15.png"); // Around middle
      expect(avatar3).toBe("/images/avatars/28.png"); // Last one

      Math.random = originalRandom;
    });

    it("always returns a valid avatar from the list", () => {
      const avatarList = getAvatarList();
      const avatarSrcs = avatarList.map((avatar) => avatar.src);

      // Test multiple times to ensure consistency
      for (let i = 0; i < 10; i++) {
        const randomAvatar = getRandomDefaultAvatar();
        expect(avatarSrcs).toContain(randomAvatar);
      }
    });
  });

  describe("getAvatarList", () => {
    it("returns an array of avatar objects", () => {
      const avatarList = getAvatarList();
      expect(Array.isArray(avatarList)).toBe(true);
      expect(avatarList.length).toBeGreaterThan(0);
    });

    it("returns avatars with correct structure", () => {
      const avatarList = getAvatarList();

      avatarList.forEach((avatar) => {
        expect(avatar).toHaveProperty("name");
        expect(avatar).toHaveProperty("src");
        expect(typeof avatar.name).toBe("string");
        expect(typeof avatar.src).toBe("string");
        expect(avatar.src).toMatch(/^\/images\/avatars\/\d+\.png$/);
      });
    });

    it("returns exactly 28 avatars", () => {
      const avatarList = getAvatarList();
      expect(avatarList).toHaveLength(28);
    });

    it("returns a copy of the list (not the original)", () => {
      const list1 = getAvatarList();
      const list2 = getAvatarList();

      expect(list1).toEqual(list2);
      expect(list1).not.toBe(list2); // Different references
    });

    it("contains expected avatar names", () => {
      const avatarList = getAvatarList();
      const names = avatarList.map((avatar) => avatar.name);

      expect(names).toContain("Avatar Aventurero");
      expect(names).toContain("Avatar Creativo");
      expect(names).toContain("Avatar Sabio");
    });
  });

  describe("getAvatarNameBySrc", () => {
    it("returns correct name for valid avatar src", () => {
      expect(getAvatarNameBySrc("/images/avatars/1.png")).toBe(
        "Avatar Aventurero"
      );
      expect(getAvatarNameBySrc("/images/avatars/2.png")).toBe(
        "Avatar Creativo"
      );
      expect(getAvatarNameBySrc("/images/avatars/28.png")).toBe("Avatar Sabio");
    });

    it('returns "Avatar Personalizado" for unknown src', () => {
      expect(getAvatarNameBySrc("/images/avatars/999.png")).toBe(
        "Avatar Personalizado"
      );
      expect(getAvatarNameBySrc("/unknown/path.png")).toBe(
        "Avatar Personalizado"
      );
      expect(getAvatarNameBySrc("")).toBe("Avatar Personalizado");
    });

    it("handles null and undefined gracefully", () => {
      expect(getAvatarNameBySrc(null as any)).toBe("Avatar Personalizado");
      expect(getAvatarNameBySrc(undefined as any)).toBe("Avatar Personalizado");
    });

    it("is case sensitive", () => {
      expect(getAvatarNameBySrc("/Images/Avatars/1.png")).toBe(
        "Avatar Personalizado"
      );
      expect(getAvatarNameBySrc("/images/avatars/1.PNG")).toBe(
        "Avatar Personalizado"
      );
    });
  });

  describe("getAvatarUrlByUserId", () => {
    const mockProfiles = [
      { userId: 1, avatar_id: 10 },
      { userId: 2, avatar_id: 20 },
      { userId: 3, avatar_id: 30 },
    ];

    const mockAvatars = [
      { id: 10, imagePath: "/images/avatars/1.png" },
      { id: 20, imagePath: "/images/avatars/2.png" },
      { id: 30, imagePath: "/images/avatars/3.png" },
    ];

    it("returns correct avatar URL for existing user", () => {
      const result = getAvatarUrlByUserId(1, mockProfiles, mockAvatars);
      expect(result).toBe("/images/avatars/1.png");
    });

    it("returns generic avatar when profile not found", () => {
      const result = getAvatarUrlByUserId(999, mockProfiles, mockAvatars);
      expect(result).toBe("/images/avatarGeneric.png");
    });

    it("returns generic avatar when avatar not found for existing profile", () => {
      const profilesWithMissingAvatar = [{ userId: 1, avatar_id: 999 }];
      const result = getAvatarUrlByUserId(
        1,
        profilesWithMissingAvatar,
        mockAvatars
      );
      expect(result).toBe("/images/avatarGeneric.png");
    });

    it("handles empty arrays gracefully", () => {
      const result = getAvatarUrlByUserId(1, [], []);
      expect(result).toBe("/images/avatarGeneric.png");
    });

    it("handles null/undefined parameters gracefully", () => {
      expect(getAvatarUrlByUserId(1, null as any, mockAvatars)).toBe(
        "/images/avatarGeneric.png"
      );
      expect(getAvatarUrlByUserId(1, mockProfiles, null as any)).toBe(
        "/images/avatarGeneric.png"
      );
    });

    it("returns generic avatar when avatar has no imagePath", () => {
      const avatarsWithoutPath = [
        { id: 10, imagePath: null },
        { id: 20, imagePath: undefined },
        { id: 30, imagePath: "" },
      ];

      expect(getAvatarUrlByUserId(1, mockProfiles, avatarsWithoutPath)).toBe(
        "/images/avatarGeneric.png"
      );
      expect(getAvatarUrlByUserId(2, mockProfiles, avatarsWithoutPath)).toBe(
        "/images/avatarGeneric.png"
      );
      expect(getAvatarUrlByUserId(3, mockProfiles, avatarsWithoutPath)).toBe(
        "/images/avatarGeneric.png"
      );
    });
  });
});
