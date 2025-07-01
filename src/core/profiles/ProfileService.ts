import IProfile from "./IProfile";
import IProfileDTO from "./IProfileDTO";
import { ProfileRepository } from "./ProfileRepository";

export default class ProfileService {
  repository: ProfileRepository;

  constructor(repository = new ProfileRepository()) {
    this.repository = repository;
  }

  async getAllProfiles(): Promise<IProfile[]> {
    return await this.repository.getAll();
  }

  async getProfileById(id: number): Promise<IProfile> {
    return await this.repository.getById(id);
  }

  async createProfile(profile: IProfileDTO): Promise<IProfile> {
    return await this.repository.create(profile);
  }

  async updateProfile(id: number, profile: IProfileDTO): Promise<IProfile> {
    return await this.repository.update(id, profile);
  }

  async updateProfileAsAdmin(
    id: number,
    profile: IProfileDTO
  ): Promise<IProfile> {
    return await this.repository.updateAsAdmin(id, profile);
  }

  async deleteProfile(id: number): Promise<void> {
    return await this.repository.delete(id);
  }
}
