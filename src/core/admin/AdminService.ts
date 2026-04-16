import { AdminRepository } from "./AdminRepository";
import { IAdmin } from "./IAdmin";
import { IAdminDTO } from "./IAdminDTO";

export default class AdminService {
  private readonly repository: AdminRepository;

  constructor(repository = new AdminRepository()) {
    this.repository = repository;
  }

  /**
   * Obtener todos los administradores
   */
  async getAllAdmins(): Promise<IAdmin[]> {
    const result = await this.repository.getAll();
    return result;
  }

  /**
   * Crear un nuevo administrador
   */
  async createAdmin(admin: IAdminDTO): Promise<IAdmin> {
    this.validateAdminData(admin);
    const result = await this.repository.create(admin);
    return result;
  }

  async getAdminById(id: number): Promise<IAdmin> {
    const result = await this.repository.getById(id);
    return result;
  }

  async updateAdmin(
    id: number,
    updateData: Partial<IAdminDTO>,
  ): Promise<IAdmin> {
    const result = await this.repository.update(id, updateData);
    return result;
  }

  async deleteAdmin(id: number): Promise<void> {
    const result = await this.repository.delete(id);
    return result;
  }

  async demoteAdminToUser(id: number): Promise<void> {
    const result = await this.repository.demoteToUser(id);
    return result;
  }

  async getTotpSecret(id: number): Promise<string> {
    const result = await this.repository.getTotpSecret(id);
    return result;
  }

  async validateTotpCode(id: number, code: string): Promise<boolean> {
    const result = await this.repository.validateTotp(id, code);
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
      if (!phoneRegex.test(admin.phone.replaceAll(/[\s-]/g, ""))) {
        errors.push("Teléfono debe ser español (9 dígitos) o internacional");
      }
    }

    if (errors.length > 0) {
      throw new Error(errors.join(", "));
    }
  }
}
