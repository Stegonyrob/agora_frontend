import IProfile from "./IProfile";
import IProfileDTO from "./IProfileDTO";
import { ProfileRepository } from "./ProfileRepository";

export default class ProfileService {
  repository: ProfileRepository;

  constructor(repository = new ProfileRepository()) {
    this.repository = repository;
  }

  // === GESTIÓN BÁSICA DE PERFILES ===

  /**
   * Obtener perfil por ID - Público
   */
  async getProfileById(id: number): Promise<IProfile> {
    console.log("[ProfileService] getProfileById:", id);
    return await this.repository.getById(id);
  }

  /**
   * Obtener perfil por DTO (legacy)
   */
  async getProfileByDTO(id: number, dto: any): Promise<IProfile> {
    console.log("[ProfileService] getProfileByDTO:", id, dto);
    return await this.repository.getByDTO(id, dto);
  }

  /**
   * Actualizar perfil - Lógica unificada (USER propio / ADMIN cualquiera)
   */
  async updateProfile(id: number, profile: IProfileDTO): Promise<IProfile> {
    console.log("[ProfileService] updateProfile:", id, profile);

    // Validar datos básicos
    this.validateProfileData(profile);

    return await this.repository.update(id, profile);
  }

  /**
   * Eliminar perfil - Lógica unificada con protecciones automáticas
   */
  async deleteProfile(id: number): Promise<void> {
    console.log("[ProfileService] deleteProfile:", id);
    return await this.repository.delete(id);
  }

  // === AUTO-GESTIÓN (USUARIO LOGUEADO) ===

  /**
   * Actualizar mi propio perfil
   */
  async updateMyProfile(profile: IProfileDTO): Promise<IProfile> {
    console.log("[ProfileService] updateMyProfile:", profile);

    // Validar datos básicos
    this.validateProfileData(profile);

    return await this.repository.updateMyProfile(profile);
  }

  /**
   * Eliminar mi cuenta (GDPR)
   */
  async deleteMyAccount(): Promise<void> {
    console.log("[ProfileService] deleteMyAccount - GDPR self-deletion");
    return await this.repository.deleteMyProfile();
  }

  // === GESTIÓN DE FAVORITOS ===

  /**
   * Obtener favoritos del usuario
   */
  async getFavorites(userId: number): Promise<any[]> {
    console.log("[ProfileService] getFavorites:", userId);
    return await this.repository.getFavorites(userId);
  }

  /**
   * Añadir/quitar favorito (toggle)
   */
  async toggleFavorite(userId: number, postId: number): Promise<any> {
    console.log("[ProfileService] toggleFavorite:", userId, postId);
    return await this.repository.toggleFavorite(userId, { postId });
  }

  /**
   * Obtener favorito específico
   */
  async getFavoriteSpecific(userId: number, postId: number): Promise<any> {
    console.log("[ProfileService] getFavoriteSpecific:", userId, postId);
    return await this.repository.getFavoriteSpecific(userId, { postId });
  }

  /**
   * Eliminar favorito
   */
  async removeFavorite(userId: number): Promise<void> {
    console.log("[ProfileService] removeFavorite:", userId);
    return await this.repository.removeFavorite(userId);
  }

  // === MÉTODOS AUXILIARES ===

  /**
   * Validar datos del perfil
   */
  private validateProfileData(profile: IProfileDTO): void {
    const errors: string[] = [];

    // Validaciones básicas
    if (profile.email && !this.isValidEmail(profile.email)) {
      errors.push("Email debe tener formato válido");
    }

    if (profile.phone && !this.isValidPhone(profile.phone)) {
      errors.push("Teléfono debe ser español (9 dígitos) o internacional");
    }

    if (errors.length > 0) {
      throw new Error(errors.join(", "));
    }
  }

  /**
   * Validar formato de email
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validar formato de teléfono
   */
  private isValidPhone(phone: string): boolean {
    const phoneRegex = /^(\+?[1-9]\d{1,14}|\d{9})$/;
    return phoneRegex.test(phone.replace(/[\s-]/g, ""));
  }

  // === MÉTODOS LEGACY (COMPATIBILIDAD) ===

  /**
   * @deprecated ProfileController no longer supports bulk listing
   */
  async getAllProfiles(): Promise<IProfile[]> {
    console.warn(
      "⚠️ ProfileService.getAllProfiles() is deprecated - ProfileController no longer supports bulk listing"
    );
    throw new Error(
      "Bulk profile listing is no longer supported by ProfileController"
    );
  }

  /**
   * @deprecated Profile creation is handled by registration
   */
  async createProfile(profile: IProfileDTO): Promise<IProfile> {
    console.warn(
      "⚠️ ProfileService.createProfile() is deprecated - Use registration endpoint instead"
    );
    throw new Error("Profile creation is handled by registration endpoint");
  }

  /**
   * @deprecated Use updateProfile() which handles permissions automatically
   */
  async updateProfileAsAdmin(
    id: number,
    profile: IProfileDTO
  ): Promise<IProfile> {
    console.warn(
      "⚠️ ProfileService.updateProfileAsAdmin() is deprecated - Use updateProfile() which handles permissions automatically"
    );
    return await this.updateProfile(id, profile);
  }
}
