import axios from "axios";
import { getAuthHeaders } from "../auth/AuthHeaders";
import { ITextItem } from "./ITextItem";
import { ITextItemDTO } from "./ITextItemDTO";

export class TextRepository {
  uri: string = import.meta.env.VITE_API_ENDPOINT_TEXTS;

  async getAll(): Promise<ITextItem[]> {
    const res = await axios.get(this.uri, { headers: getAuthHeaders() });
    return res.data;
  }

  async getById(id: number): Promise<ITextItem> {
    const res = await axios.get(`${this.uri}/${id}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  }

  async create(text: ITextItemDTO): Promise<ITextItem> {
    const res = await axios.post(this.uri, text, { headers: getAuthHeaders() });
    return res.data;
  }

  async update(id: number, text: ITextItemDTO): Promise<ITextItem> {
    const res = await axios.put(`${this.uri}/${id}`, text, {
      headers: getAuthHeaders(),
    });
    return res.data;
  }

  async delete(id: number): Promise<void> {
    await axios.delete(`${this.uri}/${id}`, { headers: getAuthHeaders() });
  }
}
