import { AdminRepository } from "./AdminRepository";
import { IAdmin, IAdminDTO } from "./IAdmin";

export default class AdminService {
  private repository: AdminRepository;

  constructor(repository = new AdminRepository()) {
    this.repository = repository;
  }

  async getAllAdmins(): Promise<IAdmin[]> {
    return await this.repository.getAll();
  }

  async createAdmin(admin: IAdminDTO): Promise<IAdmin> {
    return await this.repository.create(admin);
  }

  async deleteAdmin(id: number): Promise<void> {
    return await this.repository.delete(id);
  }
}
