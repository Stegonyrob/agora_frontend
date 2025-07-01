import axios from "axios";
import { getAuthHeaders } from "../auth/AuthHeaders";
import { ILegalText } from "./ILegalText";
import { LegalTextDTO } from "./LegalTextDTO";

export class LegalTextRepository {
  uri: string = import.meta.env.VITE_API_ENDPOINT_LEGAL;

  async getAllByType(type: string): Promise<ILegalText[]> {
    const res = await axios.get(`${this.uri}/${type}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  }

  async getByType(type: string): Promise<ILegalText> {
    const endpoint = `${this.uri}/${type}`;
    console.log(`🔍 LegalTextRepository.getByType - GET to: ${endpoint}`);

    try {
      const res = await axios.get(endpoint, {
        headers: getAuthHeaders(),
      });
      console.log(
        `✅ LegalTextRepository.getByType - Respuesta recibida:`,
        res.data
      );
      return res.data;
    } catch (error) {
      console.error(`❌ LegalTextRepository.getByType - Error en GET:`, error);
      throw error;
    }
  }

  async create(text: LegalTextDTO): Promise<ILegalText> {
    console.warn("⚠️ CREATE disabled for legal texts. Use UPDATE instead.");
    throw new Error(
      "CREATE operation disabled for legal texts. Use UPDATE instead."
    );
    // const res = await axios.post(this.uri, text, { headers: getAuthHeaders() });
    // return res.data;
  }

  async update(type: string, text: LegalTextDTO): Promise<ILegalText> {
    const endpoint = `${this.uri}/${type}`;
    console.log(`🔗 LegalTextRepository.update - PUT to: ${endpoint}`);
    console.log(`📤 LegalTextRepository.update - Payload:`, text);
    console.log(`🔐 LegalTextRepository.update - Headers:`, getAuthHeaders());

    try {
      const res = await axios.put(endpoint, text, {
        headers: getAuthHeaders(),
      });
      console.log(
        `✅ LegalTextRepository.update - Respuesta exitosa:`,
        res.data
      );
      console.log(`📊 LegalTextRepository.update - Status code:`, res.status);
      return res.data;
    } catch (error: any) {
      console.error(`❌ LegalTextRepository.update - Error en PUT:`, error);
      console.error(
        `📊 LegalTextRepository.update - Status code:`,
        error?.response?.status
      );
      console.error(
        `📝 LegalTextRepository.update - Error response:`,
        error?.response?.data
      );
      console.error(`🔍 LegalTextRepository.update - Full error:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    await axios.delete(`${this.uri}/${id}`, { headers: getAuthHeaders() });
  }
}
