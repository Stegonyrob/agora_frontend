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
    console.log(
      `🔍 LegalTextService.getLegalTextByType - Obteniendo texto para tipo: ${type}`
    );

    try {
      const result = await this.repository.getByType(type);
      console.log(
        `✅ LegalTextService.getLegalTextByType - Texto obtenido:`,
        result
      );
      return result;
    } catch (error) {
      console.error(
        `❌ LegalTextService.getLegalTextByType - Error obteniendo texto:`,
        error
      );
      throw error;
    }
  }

  async createLegalText(text: LegalTextDTO): Promise<ILegalText> {
    console.warn("⚠️ CREATE disabled for legal texts. Use UPDATE instead.");
    throw new Error(
      "CREATE operation disabled for legal texts. Use UPDATE instead."
    );
    // return await this.repository.create(text);
  }

  async updateLegalText(type: string, text: LegalTextDTO): Promise<ILegalText> {
    console.log(
      `🔄 LegalTextService.updateLegalText - Iniciando actualización para tipo: ${type}`
    );
    console.log(`📝 LegalTextService.updateLegalText - Datos a enviar:`, text);

    try {
      const result = await this.repository.update(type, text);
      console.log(
        `✅ LegalTextService.updateLegalText - Actualización exitosa:`,
        result
      );
      return result;
    } catch (error) {
      console.error(
        `❌ LegalTextService.updateLegalText - Error en actualización:`,
        error
      );
      throw error;
    }
  }

  async deleteLegalText(id: number): Promise<void> {
    return await this.repository.delete(id);
  }
}
