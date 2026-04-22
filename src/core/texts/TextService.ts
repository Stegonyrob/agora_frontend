import { IText } from "./IText";
import { ITextDTO } from "./ITextDTO";
import { TextRepository } from "./TextRepository";

export default class TextService {
  repository: TextRepository;

  constructor(repository = new TextRepository()) {
    this.repository = repository;
  }

  async getAllTexts(): Promise<IText[]> {
    const texts = await this.repository.getAll();
    return texts;
  }

  async getTextById(id: number): Promise<IText> {
    return await this.repository.getById(id);
  }

  async createText(text: ITextDTO): Promise<IText> {
    return await this.repository.create(text);
  }

  async updateText(id: number, text: ITextDTO): Promise<IText> {
    return await this.repository.update(id, text);
  }

  async deleteText(id: number): Promise<void> {
    return await this.repository.delete(id);
  }

  async archiveText(textId: number, archive: boolean): Promise<void> {
    return await this.repository.archive(textId, archive);
  }

  async unArchiveText(textId: number): Promise<void> {
    return await this.repository.archive(textId, false);
  }

  async getTextsByCategory(category: string): Promise<IText[]> {
    return await this.repository.getByCategory(category);
  }
}
