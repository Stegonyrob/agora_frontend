import IUser from "./IUser";
import IUserDTO from "./IUserDTO";
import { UserRepository } from "./UserRepository";

export default class UserService {
  repository: UserRepository;

  constructor(repository = new UserRepository()) {
    this.repository = repository;
  }

  async getAllUsers(): Promise<IUser[]> {
    return await this.repository.getAll();
  }

  async getUserById(id: number): Promise<IUser> {
    return await this.repository.getById(id);
  }

  async createUser(user: IUserDTO): Promise<IUser> {
    return await this.repository.create(user);
  }

  async updateUser(id: number, user: IUserDTO): Promise<IUser> {
    return await this.repository.update(id, user);
  }

  async deleteUser(id: number): Promise<void> {
    return await this.repository.delete(id);
  }
}
