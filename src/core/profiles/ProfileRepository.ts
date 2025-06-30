import axios from "axios";
import { getAuthHeaders } from "../auth/AuthHeaders";
import IProfile from "./IProfile";
import IProfileDTO from "./IProfileDTO";

export class ProfileRepository {
  uri: string = import.meta.env.VITE_API_ENDPOINT_PROFILE;

  async getAll(): Promise<IProfile[]> {
    const res = await axios.get(`${this.uri}`, {
      headers: getAuthHeaders(),
    });

    // Mapear avatarId (backend) a avatar_id (frontend) para cada perfil
    const profiles = res.data.map((profileData: any) => {
      if (profileData.avatarId && !profileData.avatar_id) {
        profileData.avatar_id = profileData.avatarId;
      }
      return profileData;
    });

    return profiles;
  }

  async getById(id: number): Promise<IProfile> {
    const res = await axios.get(`${this.uri}/${id}`, {
      headers: getAuthHeaders(),
    });
    console.log("🔍 ProfileRepository.getById - Raw response:", res.data);

    // Mapear avatarId (backend) a avatar_id (frontend)
    const profileData = res.data;
    if (profileData.avatarId && !profileData.avatar_id) {
      profileData.avatar_id = profileData.avatarId;
    }

    console.log("🔍 ProfileRepository.getById - Mapped profile:", profileData);
    return profileData;
  }

  async create(profile: IProfileDTO): Promise<IProfile> {
    const res = await axios.post(`${this.uri}`, profile, {
      headers: getAuthHeaders(),
    });

    // Mapear avatarId (backend) a avatar_id (frontend)
    const profileData = res.data;
    if (profileData.avatarId && !profileData.avatar_id) {
      profileData.avatar_id = profileData.avatarId;
    }

    return profileData;
  }

  async update(id: number, profile: IProfileDTO): Promise<IProfile> {
    console.log("🚀 ProfileRepository.update - id:", id);
    console.log("🚀 ProfileRepository.update - profile:", profile);
    console.log(
      "🚀 ProfileRepository.update - profile.avatar_id:",
      profile.avatar_id
    );
    console.log(
      "🚀 ProfileRepository.update - JSON.stringify(profile):",
      JSON.stringify(profile)
    );

    const res = await axios.put(`${this.uri}/${id}`, profile, {
      headers: getAuthHeaders(),
    });

    console.log("🔍 ProfileRepository.update - Raw response:", res.data);

    // Mapear avatarId (backend) a avatar_id (frontend)
    const profileData = res.data;
    if (profileData.avatarId && !profileData.avatar_id) {
      profileData.avatar_id = profileData.avatarId;
    }

    console.log("🔍 ProfileRepository.update - Mapped profile:", profileData);
    return profileData;
  }

  async delete(id: number): Promise<void> {
    await axios.delete(`${this.uri}/${id}`, {
      headers: getAuthHeaders(),
    });
  }
}
