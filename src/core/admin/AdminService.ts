import { AdminRepository } from "./AdminRepository";
import { IAdmin, IAdminDTO } from "./IAdmin";

export default class AdminService {
  private repository: AdminRepository;

  constructor(repository = new AdminRepository()) {
    this.repository = repository;
  }

  async getAllAdmins(): Promise<IAdmin[]> {
    console.log("[AdminService] getAllAdmins: llamando a repository.getAll()");
    const result = await this.repository.getAll();
    console.log("[AdminService] getAllAdmins: resultado", result);
    return result;
  }

  async createAdmin(admin: IAdminDTO): Promise<IAdmin> {
    console.log("[AdminService] createAdmin: datos recibidos", admin);
    const result = await this.repository.create(admin);
    console.log("[AdminService] createAdmin: resultado", result);
    return result;
  }

  async deleteAdmin(id: number): Promise<void> {
    console.log("[AdminService] deleteAdmin: id", id);
    const result = await this.repository.delete(id);
    console.log("[AdminService] deleteAdmin: resultado", result);
    return result;
  }
}
