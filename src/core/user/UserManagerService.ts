import BannedService from "@/core/banned/BannedService";
import ProfileService from "@/core/profiles/ProfileService";
import IUser from "@/core/user/IUser";
import IUserDTO from "@/core/user/IUserDTO";
import UserService from "@/core/user/UserService";

export class UserManagerService {
  private userService = new UserService();
  private profileService = new ProfileService();
  private bannedService = new BannedService();

  async loadUsers(): Promise<IUser[]> {
    // Los usuarios ya vienen con banned y banReason desde el backend
    return await this.userService.getAllUsers();
  }

  async updateUser(userId: number, userData: IUserDTO): Promise<void> {
    // Usar ProfileService para actualizar el perfil usando PUT /api/v1/any/admin/user/profile/{profileId}
    const profileData = {
      firstName: userData.firstName || "",
      lastName1: userData.lastName1 || "",
      lastName2: userData.lastName2 || "",
      avatarId: userData.avatarId || undefined,
      email: userData.email || "",
    };
    await this.profileService.updateProfileAsAdmin(userId, profileData);
  }

  async deleteUser(userId: number): Promise<void> {
    // Usar UserService para eliminar el usuario completo usando DELETE /api/v1/any/user/{userId}
    await this.userService.deleteUser(userId);
  }

  async banUser(userId: number, reason: string): Promise<void> {
    await this.bannedService.banUser(userId, reason);
  }

  async unbanUser(userId: number): Promise<void> {
    await this.bannedService.unbanUser(userId);
  }
}
