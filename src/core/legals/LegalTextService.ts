import { ILegalText } from "./ILegalText";
import { LegalTextDTO } from "./LegalTextDTO";
import { LegalTextRepository } from "./LegalTextRepository";

export class LegalTextService {
  repository: LegalTextRepository;

  constructor(repository = new LegalTextRepository()) {
    this.repository = repository;
  }

  async getLegalTexts(type: string): Promise<ILegalText[]> {
    return await this.repository.getAllByType(type);
  }

  async getLegalTextByType(type: string): Promise<ILegalText> {
    return await this.repository.getByType(type);
  }

  async createLegalText(text: LegalTextDTO): Promise<ILegalText> {
    return await this.repository.create(text);
  }

  async updateLegalText(id: number, text: LegalTextDTO): Promise<ILegalText> {
    return await this.repository.update(id, text);
  }

  async deleteLegalText(id: number): Promise<void> {
    return await this.repository.delete(id);
  }
}
