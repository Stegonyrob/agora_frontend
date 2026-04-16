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
    const res = await axios.get(endpoint, {
      headers: getAuthHeaders(),
    });
    return res.data;
  }

  async create(text: LegalTextDTO): Promise<ILegalText> {
    console.warn("⚠️ CREATE disabled for legal texts. Use UPDATE instead.");
    throw new Error(
      "CREATE operation disabled for legal texts. Use UPDATE instead.",
    );
  }

  async update(type: string, text: LegalTextDTO): Promise<ILegalText> {
    const endpoint = `${this.uri}/${type}`;
    const res = await axios.put(endpoint, text, {
      headers: getAuthHeaders(),
    });
    return res.data;
  }

  async delete(id: number): Promise<void> {
    await axios.delete(`${this.uri}/${id}`, { headers: getAuthHeaders() });
  }
}
