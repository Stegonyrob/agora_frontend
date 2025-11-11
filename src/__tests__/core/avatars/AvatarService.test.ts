import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AvatarService from "../../../core/avatars/AvatarService";
import IAvatar from "../../../core/avatars/IAvatar";

const baseAvatar = {
  userId: 1,
  createdAt: "2023-01-01T00:00:00Z",
  updatedAt: "2023-01-01T00:00:00Z",
};
const mockRepository = {
  getAvatarsForSelector: vi.fn().mockResolvedValue([
    {
      id: 1,
      imagePath: "/img1.png",
      isCustom: false,
      isDefault: false,
      name: "SelectorAvatar",
      ...baseAvatar,
    },
  ]),
  getDefaultAvatar: vi.fn().mockResolvedValue({
    id: 99,
    imagePath: "/default.png",
    isCustom: false,
    isDefault: true,
    name: "DefaultAvatar",
    ...baseAvatar,
  }),
  getById: vi.fn().mockResolvedValue({
    id: 2,
    imagePath: "/img2.png",
    isCustom: true,
    isDefault: false,
    name: "ByIdAvatar",
    ...baseAvatar,
  }),
  getAvatarImage: vi.fn().mockResolvedValue(new Blob(["avatar"])),
  getByImageName: vi.fn().mockResolvedValue({
    id: 3,
    imagePath: "/img3.png",
    isCustom: false,
    isDefault: false,
    name: "ByImageNameAvatar",
    ...baseAvatar,
  }),
  uploadCustomAvatar: vi.fn().mockResolvedValue({
    id: 4,
    imagePath: "/custom.png",
    isCustom: true,
    isDefault: false,
    name: "CustomAvatar",
    ...baseAvatar,
  }),
};

describe("AvatarService", () => {
  let service: AvatarService;

  beforeEach(() => {
    service = new AvatarService(mockRepository as any);
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("getAvatarsForSelector returns avatars", async () => {
    const avatars = await service.getAvatarsForSelector();
    expect(avatars).toHaveLength(1);
    expect(mockRepository.getAvatarsForSelector).toHaveBeenCalled();
  });

  it("getDefaultAvatar returns default avatar", async () => {
    const avatar = await service.getDefaultAvatar();
    expect(avatar.id).toBe(99);
    expect(mockRepository.getDefaultAvatar).toHaveBeenCalled();
  });

  it("getAvatarById returns avatar by id", async () => {
    const avatar = await service.getAvatarById(2);
    expect(avatar.id).toBe(2);
    expect(mockRepository.getById).toHaveBeenCalledWith(2);
  });

  it("getAvatarImageUrl returns correct url for custom avatar", async () => {
    vi.stubEnv("VITE_API_ENDPOINT_AVATARS", "http://api.test/avatars");

    const avatar: IAvatar = {
      id: 5,
      imagePath: "",
      isCustom: true,
      isDefault: false,
      name: "CustomTest",
      userId: 2,
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z",
    };
    const url = await service.getAvatarImageUrl(avatar);
    expect(url).toBe("http://api.test/avatars/5/image");
  });

  it("getAvatarImageUrl returns correct url for system avatar", async () => {
    const avatar: IAvatar = {
      id: 6,
      imagePath: "/sys.png",
      isCustom: false,
      isDefault: true,
      name: "SysTest",
      userId: 3,
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z",
    };
    const url = await service.getAvatarImageUrl(avatar);
    expect(url).toBe("/sys.png");
  });

  it("getAvatarImageBlob returns blob", async () => {
    const blob = await service.getAvatarImageBlob(2);
    expect(blob).toBeInstanceOf(Blob);
    expect(mockRepository.getAvatarImage).toHaveBeenCalledWith(2);
  });

  it("getAvatarByImageName returns avatar", async () => {
    const avatar = await service.getAvatarByImageName("img3.png");
    expect(avatar.id).toBe(3);
    expect(mockRepository.getByImageName).toHaveBeenCalledWith("img3.png");
  });

  it("uploadCustomAvatar uploads avatar", async () => {
    const file = new File(["avatar"], "avatar.png", { type: "image/png" });
    const avatar = await service.uploadCustomAvatar(file, 7);
    expect(avatar.id).toBe(4);
    expect(mockRepository.uploadCustomAvatar).toHaveBeenCalled();
  });
});
