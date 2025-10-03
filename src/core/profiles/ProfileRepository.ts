import axios from "axios";
import { getAuthHeaders } from "../auth/AuthHeaders";
import IProfile from "./IProfile";
import IProfileDTO from "./IProfileDTO";

export class ProfileRepository {
  // Base URL unificada para el ProfileController optimizado
  private profileBaseUri: string = import.meta.env
    .VITE_API_ENDPOINT_PROFILE_BASE; // http://localhost:8080/api/v1/any/user/profile
  private favoritesBaseUri: string = import.meta.env
    .VITE_API_ENDPOINT_PROFILE_FAVORITES; // favoritos

  // === GESTIÓN BÁSICA DE PERFILES ===

  /**
   * POST /api/v1/any/user/profile/{id} - Obtener perfil por DTO (legacy)
   */
  async getByDTO(id: number, dto: any): Promise<IProfile> {
    const res = await axios.post(`${this.profileBaseUri}/${id}`, dto, {
      headers: getAuthHeaders(),
    });
    return this.mapProfileResponse(res.data);
  }

  /**
   * GET /api/v1/any/user/profile/{id} - Obtener perfil por ID
   */
  async getById(id: number): Promise<IProfile> {
    const res = await axios.get(`${this.profileBaseUri}/${id}`, {
      headers: getAuthHeaders(),
    });
    return this.mapProfileResponse(res.data);
  }

  /**
   * PUT /api/v1/any/user/profile/{id} - Actualizar perfil (USER propio / ADMIN cualquiera)
   * ✅ Lógica unificada: USER solo su perfil, ADMIN cualquier perfil
   */
  async update(id: number, profile: IProfileDTO): Promise<IProfile> {
    // Profile update initiated
    console.log(
      "[ProfileRepository.update] Endpoint:",
      `${this.profileBaseUri}/${id}`
    );
    // Processing profile update
    // Profile data prepared

    try {
      const res = await axios.put(`${this.profileBaseUri}/${id}`, profile, {
        headers: getAuthHeaders(),
      });
      // Update successful
      return this.mapProfileResponse(res.data);
    } catch (error) {
      console.error("[ProfileRepository.update] Error:", error);
      throw error;
    }
  }

  /**
   * DELETE /api/v1/any/user/profile/{id} - Eliminar perfil (USER propio / ADMIN cualquiera)
   * ✅ Lógica unificada: Detecta automáticamente permisos y aplica GDPR
   */
  async delete(id: number): Promise<void> {
    console.log(
      "🗑️ ProfileRepository.delete - Endpoint:",
      `${this.profileBaseUri}/${id}`
    );
    await axios.delete(`${this.profileBaseUri}/${id}`, {
      headers: getAuthHeaders(),
    });
  }

  // === AUTO-GESTIÓN (USUARIO LOGUEADO) ===

  /**
   * PUT /api/v1/any/user/profile/me - Actualizar mi propio perfil
   */
  async updateMyProfile(profile: IProfileDTO): Promise<IProfile> {
    // My profile data prepared

    const res = await axios.put(`${this.profileBaseUri}/me`, profile, {
      headers: getAuthHeaders(),
    });
    // My profile update successful
    return this.mapProfileResponse(res.data);
  }

  /**
   * DELETE /api/v1/any/user/profile/me - Eliminar mi cuenta (GDPR)
   */
  async deleteMyProfile(): Promise<void> {
    console.log("🗑️ ProfileRepository.deleteMyProfile - Self-deletion (GDPR)");
    await axios.delete(`${this.profileBaseUri}/me`, {
      headers: getAuthHeaders(),
    });
  }

  // === GESTIÓN DE FAVORITOS ===

  /**
   * GET /api/v1/any/user/profile/user/profile/favorite/{id} - Obtener favoritos
   */
  async getFavorites(id: number): Promise<any[]> {
    const res = await axios.get(`${this.favoritesBaseUri}/${id}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  }

  /**
   * PUT /api/v1/any/user/profile/user/profile/favorite/{id} - Añadir/quitar favorito (toggle)
   */
  async toggleFavorite(id: number, data: any): Promise<any> {
    const res = await axios.put(`${this.favoritesBaseUri}/${id}`, data, {
      headers: getAuthHeaders(),
    });
    return res.data;
  }

  /**
   * POST /api/v1/any/user/profile/user/profile/favorite/{id} - Obtener favorito específico
   */
  async getFavoriteSpecific(id: number, data: any): Promise<any> {
    const res = await axios.post(`${this.favoritesBaseUri}/${id}`, data, {
      headers: getAuthHeaders(),
    });
    return res.data;
  }

  /**
   * DELETE /api/v1/any/user/profile/user/profile/favorite/{id} - Eliminar favorito (toggle)
   */
  async removeFavorite(id: number): Promise<void> {
    await axios.delete(`${this.favoritesBaseUri}/${id}`, {
      headers: getAuthHeaders(),
    });
  }

  // === MÉTODOS AUXILIARES ===

  /**
   * Mapear respuesta del backend (avatarId -> avatar_id)
   */
  private mapProfileResponse(profileData: any): IProfile {
    if (profileData.avatarId && !profileData.avatar_id) {
      profileData.avatar_id = profileData.avatarId;
    }
    return profileData;
  }

  // === MÉTODOS LEGACY (COMPATIBILIDAD) ===

  /**
   * @deprecated Usar getById() instead
   */
  async getAll(): Promise<IProfile[]> {
    console.warn(
      "⚠️ ProfileRepository.getAll() is deprecated - ProfileController no longer supports bulk listing"
    );
    throw new Error(
      "Bulk profile listing is no longer supported. Use getById() for specific profiles."
    );
  }

  /**
   * @deprecated No longer needed - create is handled by registration
   */
  async create(profile: IProfileDTO): Promise<IProfile> {
    console.warn(
      "⚠️ ProfileRepository.create() is deprecated - Use registration endpoint instead"
    );
    throw new Error("Profile creation is handled by registration endpoint");
  }

  /**
   * @deprecated Usar update() instead (now handles both USER and ADMIN automatically)
   */
  async updateAsAdmin(id: number, profile: IProfileDTO): Promise<IProfile> {
    console.warn(
      "⚠️ ProfileRepository.updateAsAdmin() is deprecated - Use update() which handles permissions automatically"
    );
    return this.update(id, profile);
  }
}
