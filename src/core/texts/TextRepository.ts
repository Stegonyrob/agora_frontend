import axios from "axios";
import { getAuthHeaders } from "../auth/AuthHeaders";
import { IText } from "./IText";
import { ITextDTO } from "./ITextDTO";

export class TextRepository {
  uri: string = import.meta.env.VITE_API_ENDPOINT_TEXTS;

  async getAll(): Promise<IText[]> {
    const res = await axios.get(this.uri, { headers: getAuthHeaders() });
    return res.data;
  }

  async getById(id: number): Promise<IText> {
    const res = await axios.get(`${this.uri}/${id}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  }

  async create(text: ITextDTO): Promise<IText> {
    // Usar el endpoint de admin para crear textos
    const adminEndpoint = this.uri.replace("/all/texts", "/admin/texts");
    const res = await axios.post(adminEndpoint, text, {
      headers: getAuthHeaders(),
    });
    return res.data;
  }

  async update(id: number, text: ITextDTO): Promise<IText> {
    // Usar el endpoint de admin para actualizar textos
    const adminEndpoint = this.uri.replace("/all/texts", "/admin/texts");
    const res = await axios.put(`${adminEndpoint}/${id}`, text, {
      headers: getAuthHeaders(),
    });
    return res.data;
  }

  async delete(id: number): Promise<void> {
    // Usar el endpoint de admin para eliminar textos
    const adminEndpoint = this.uri.replace("/all/texts", "/admin/texts");
    await axios.delete(`${adminEndpoint}/${id}`, { headers: getAuthHeaders() });
  }

  // Archivar/desarchivar un texto (solo admin)
  async archive(textId: number, archive: boolean): Promise<void> {
    // Usar el endpoint de admin para archivar textos
    const adminEndpoint = this.uri.replace("/all/texts", "/admin/texts");
    await axios.patch(
      `${adminEndpoint}/${textId}/archive?archive=${archive}`,
      null,
      { headers: getAuthHeaders() }
    );
  }
}
