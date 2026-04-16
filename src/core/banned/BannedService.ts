import { BannedRepository } from "./BannedRepository";
import IBanned from "./IBanned";
import IBannedDTO from "./IBannedDTO";

export default class BannedService {
  repository: BannedRepository;

  constructor(repository = new BannedRepository()) {
    this.repository = repository;
  }

  async getAllBanned(): Promise<IBanned[]> {
    return await this.repository.getAll();
  }

  async getBannedByUserId(userId: number): Promise<IBanned | null> {
    return await this.repository.getByUserId(userId);
  }

  async banUser(userId: number, reason: string): Promise<IBanned> {
    const bannedData: IBannedDTO = { userId, reason };
    return await this.repository.create(bannedData);
  }

  async updateBan(id: number, reason: string): Promise<IBanned> {
    const bannedData: IBannedDTO = {
      userId: 0, // Este valor probablemente no se use en el update
      reason,
    };
    return await this.repository.update(id, bannedData);
  }

  async unbanUser(userId: number): Promise<void> {
    return await this.repository.delete(userId);
  }
}
