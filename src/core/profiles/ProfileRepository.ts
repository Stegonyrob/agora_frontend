import axios from "axios";
import { getAuthHeaders } from "../auth/AuthHeaders";
import IProfile from "./IProfile";
import IProfileDTO from "./IProfileDTO";

export class ProfileRepository {
  uri: string = import.meta.env.VITE_API_ENDPOINT_PROFILE;
  adminUri: string = import.meta.env.VITE_API_ENDPOINT_PROFILE.replace(
    "/any/user/profile",
    "/any/user/profile/admin/user/profile"
  );

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
    console.log("[ProfileRepository.update] ---");
    console.log("[ProfileRepository.update] Endpoint:", `${this.uri}/${id}`);
    console.log("[ProfileRepository.update] ID:", id);
    console.log("[ProfileRepository.update] Profile DTO:", profile);
    console.log(
      "[ProfileRepository.update] Profile JSON:",
      JSON.stringify(profile)
    );
    if (profile.avatar_id !== undefined) {
      console.log(
        "[ProfileRepository.update] avatar_id:",
        profile.avatar_id,
        typeof profile.avatar_id
      );
    }
    if (profile.avatarId !== undefined) {
      console.log(
        "[ProfileRepository.update] avatarId:",
        profile.avatarId,
        typeof profile.avatarId
      );
    }
    try {
      const res = await axios.put(`${this.uri}/${id}`, profile, {
        headers: getAuthHeaders(),
      });
      console.log("[ProfileRepository.update] Raw response:", res.data);
      // Mapear avatarId (backend) a avatar_id (frontend)
      const profileData = res.data;
      if (profileData.avatarId && !profileData.avatar_id) {
        profileData.avatar_id = profileData.avatarId;
      }
      console.log("[ProfileRepository.update] Mapped profile:", profileData);
      return profileData;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("[ProfileRepository.update] Axios error:", error.message);
        if (error.response) {
          console.error(
            "[ProfileRepository.update] Response data:",
            error.response.data
          );
          console.error(
            "[ProfileRepository.update] Response status:",
            error.response.status
          );
          console.error(
            "[ProfileRepository.update] Response headers:",
            error.response.headers
          );
        }
      } else {
        console.error("[ProfileRepository.update] Unknown error:", error);
      }
      throw error;
    }
  }

  // ✅ Para administradores - URL corregida
  async updateAsAdmin(id: number, profile: IProfileDTO): Promise<IProfile> {
    console.log("🚀 ProfileRepository.updateAsAdmin - id:", id);
    console.log("🚀 ProfileRepository.updateAsAdmin - profile:", profile);
    console.log(
      "🔗 ProfileRepository.updateAsAdmin - Using ADMIN endpoint:",
      `${this.adminUri}/${id}`
    );

    const res = await axios.put(`${this.adminUri}/${id}`, profile, {
      headers: getAuthHeaders(),
    });

    console.log("🔍 ProfileRepository.updateAsAdmin - Raw response:", res.data);

    // Mapear avatarId (backend) a avatar_id (frontend)
    const profileData = res.data;
    if (profileData.avatarId && !profileData.avatar_id) {
      profileData.avatar_id = profileData.avatarId;
    }

    console.log(
      "🔍 ProfileRepository.updateAsAdmin - Mapped profile:",
      profileData
    );
    return profileData;
  }

  async delete(id: number): Promise<void> {
    console.log(
      "🗑️ ProfileRepository.delete - Using ADMIN endpoint:",
      `${this.adminUri}/${id}`
    );
    await axios.delete(`${this.adminUri}/${id}`, {
      headers: getAuthHeaders(),
    });
  }
}
