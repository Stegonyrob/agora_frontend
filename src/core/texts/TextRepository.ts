import axios from "axios";
import { getAuthHeaders } from "../auth/AuthHeaders";
import { IText } from "./IText";
import { ITextDTO } from "./ITextDTO";

export class TextRepository {
  uri: string = import.meta.env.VITE_API_ENDPOINT_TEXTS;

  async getAll(): Promise<IText[]> {
    try {
      const res = await axios.get(this.uri, { headers: getAuthHeaders() });
      return res.data || [];
    } catch (error: any) {
      console.error(`[TextRepository] Error fetching texts:`, {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        url: this.uri,
      });
      // Retornar array vacío en lugar de lanzar error para no romper la UI
      return [];
    }
  }

  async getById(id: number): Promise<IText> {
    const res = await axios.get(`${this.uri}/${id}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  }

  async create(text: ITextDTO): Promise<IText> {
    // Usar el endpoint correcto del backend: /api/v1/all/texts
    const res = await axios.post(this.uri, text, {
      headers: getAuthHeaders(),
    });
    return res.data;
  }

  async update(id: number, text: ITextDTO): Promise<IText> {
    try {
      // Usar el endpoint correcto del backend: /api/v1/all/texts/{id}
      const res = await axios.put(`${this.uri}/${id}`, text, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error: any) {
      // Si es error 500, probablemente el texto no existe en el backend
      if (error.response?.status === 500) {
        console.error(
          `❌ TextRepository.update - Texto ID ${id} no existe en backend`,
        );
        throw new Error(
          `El texto ID ${id} no existe en el servidor. Puede que haya sido eliminado.`,
        );
      }
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    // Usar el endpoint correcto del backend: /api/v1/all/texts/{id}
    await axios.delete(`${this.uri}/${id}`, { headers: getAuthHeaders() });
  }

  // Archivar/desarchivar un texto (solo admin)
  async archive(textId: number, archive: boolean): Promise<void> {
    // Usar el endpoint correcto del backend: /api/v1/all/texts/{id}/archive
    await axios.patch(
      `${this.uri}/${textId}/archive?archive=${archive}`,
      null,
      { headers: getAuthHeaders() },
    );
  }
}
