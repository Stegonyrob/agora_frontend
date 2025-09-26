import { ITextItem } from "./IText";
import { ITextItemDTO } from "./ITextDTO";
import { TextRepository } from "./TextRepository";

export default class TextService {
  repository: TextRepository;

  constructor(repository = new TextRepository()) {
    this.repository = repository;
  }

  async getAllTexts(): Promise<ITextItem[]> {
    const texts = await this.repository.getAll();
    return texts;
  }

  async getTextById(id: number): Promise<ITextItem> {
    return await this.repository.getById(id);
  }

  async createText(text: ITextItemDTO): Promise<ITextItem> {
    return await this.repository.create(text);
  }

  async updateText(id: number, text: ITextItemDTO): Promise<ITextItem> {
    return await this.repository.update(id, text);
  }

  async deleteText(id: number): Promise<void> {
    return await this.repository.delete(id);
  }
}
