import { AdminRepository } from "./AdminRepository";
import { IAdmin } from "./IAdmin";
import { IAdminDTO } from "./IAdminDTO";

export default class AdminService {
  private repository: AdminRepository;

  constructor(repository = new AdminRepository()) {
    this.repository = repository;
  }

  /**
   * Obtener todos los administradores
   */
  async getAllAdmins(): Promise<IAdmin[]> {
    console.log("[AdminService] getAllAdmins: llamando a repository.getAll()");
    const result = await this.repository.getAll();
    console.log("[AdminService] getAllAdmins: resultado", result);
    return result;
  }

  /**
   * Crear un nuevo administrador
   */
  async createAdmin(admin: IAdminDTO): Promise<IAdmin> {
    console.log("[AdminService] createAdmin: datos recibidos", admin);

    // Validar campos obligatorios
    this.validateAdminData(admin);

    const result = await this.repository.create(admin);
    console.log("[AdminService] createAdmin: resultado", result);
    return result;
  }

  /**
   * Obtener administrador por ID
   */
  async getAdminById(id: number): Promise<IAdmin> {
    console.log("[AdminService] getAdminById: id", id);
    const result = await this.repository.getById(id);
    console.log("[AdminService] getAdminById: resultado", result);
    return result;
  }

  /**
   * Actualizar administrador
   */
  async updateAdmin(
    id: number,
    updateData: Partial<IAdminDTO>
  ): Promise<IAdmin> {
    console.log("[AdminService] updateAdmin: id", id, "datos", updateData);
    const result = await this.repository.update(id, updateData);
    console.log("[AdminService] updateAdmin: resultado", result);
    return result;
  }

  /**
   * Eliminar administrador
   */
  async deleteAdmin(id: number): Promise<void> {
    console.log("[AdminService] deleteAdmin: id", id);
    const result = await this.repository.delete(id);
    console.log("[AdminService] deleteAdmin: resultado", result);
    return result;
  }

  /**
   * Degradar administrador a usuario común
   */
  async demoteAdminToUser(id: number): Promise<void> {
    console.log("[AdminService] demoteAdminToUser: id", id);
    const result = await this.repository.demoteToUser(id);
    console.log("[AdminService] demoteAdminToUser: completado");
    return result;
  }

  /**
   * Obtener secreto TOTP para 2FA
   */
  async getTotpSecret(id: number): Promise<string> {
    console.log("[AdminService] getTotpSecret: id", id);
    const result = await this.repository.getTotpSecret(id);
    console.log("[AdminService] getTotpSecret: resultado", result);
    return result;
  }

  /**
   * Validar código TOTP para 2FA
   */
  async validateTotpCode(id: number, code: string): Promise<boolean> {
    console.log("[AdminService] validateTotpCode: id", id, "code", code);
    const result = await this.repository.validateTotp(id, code);
    console.log("[AdminService] validateTotpCode: resultado", result);
    return result;
  }

  /**
   * Validar datos del administrador según la documentación
   */
  private validateAdminData(admin: IAdminDTO): void {
    const errors: string[] = [];

    // Campos obligatorios
    if (!admin.username?.trim()) errors.push("Username es obligatorio");
    if (!admin.email?.trim()) errors.push("Email es obligatorio");
    if (!admin.password?.trim()) errors.push("Password es obligatorio");
    if (!admin.confirmPassword?.trim())
      errors.push("Confirm password es obligatorio");
    if (!admin.phone?.trim()) errors.push("Phone es obligatorio");
    if (!admin.firstName?.trim()) errors.push("Primer nombre es obligatorio");
    if (!admin.lastName1?.trim()) errors.push("Primer apellido es obligatorio");

    // Validar que las contraseñas coincidan
    if (admin.password !== admin.confirmPassword) {
      errors.push("Las contraseñas no coinciden");
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (admin.email && !emailRegex.test(admin.email)) {
      errors.push("Email debe tener formato válido");
    }

    // Validar teléfono (español 9 dígitos o internacional)
    if (admin.phone) {
      const phoneRegex = /^(\+?[1-9]\d{1,14}|\d{9})$/;
      if (!phoneRegex.test(admin.phone.replace(/[\s-]/g, ""))) {
        errors.push("Teléfono debe ser español (9 dígitos) o internacional");
      }
    }

    if (errors.length > 0) {
      throw new Error(errors.join(", "));
    }
  }
}
