import axios from "axios";
import { getAuthHeaders } from "../auth/AuthHeaders";
import { IImage } from "./IImage";

export class ImageRepository {
  uri: string = import.meta.env.VITE_API_ENDPOINT_IMAGES;

  async getAll(): Promise<IImage[]> {
    const res = await axios.get(this.uri, { headers: getAuthHeaders() });
    return res.data;
  }

  async upload(formData: FormData): Promise<IImage[]> {
    const res = await axios.post(this.uri, formData, {
      headers: getAuthHeaders(),
    });
    return res.data; // Devuelve array de imágenes subidas
  }

  async delete(imageName: string): Promise<void> {
    await axios.delete(`${this.uri}/${imageName}`, {
      headers: getAuthHeaders(),
    });
  }
}
