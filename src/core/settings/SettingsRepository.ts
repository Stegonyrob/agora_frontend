import axios from "axios";
import { getAuthHeaders } from "../auth/AuthHeaders";
import { ISettings } from "./ISettings";
import { SettingsDTO } from "./SettingsDTO";

export class SettingsRepository implements SettingsDTO {
  uri: string = import.meta.env.VITE_API_ENDPOINT_USERS;

  async getSettings(userId: number): Promise<ISettings> {
    const res = await axios.get(`${this.uri}/settings/${userId}`, {
      headers: getAuthHeaders(),
    });
    if (res.status !== 200)
      throw new Error("No se pudieron cargar los settings");
    return res.data;
  }

  async saveSettings(userId: number, settings: ISettings): Promise<void> {
    // Usa POST y Content-Type explícito
    const res = await axios.post(
      `${this.uri}/settings/${userId}`,
      JSON.stringify(settings),
      {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      }
    );
    if (res.status !== 200 && res.status !== 201)
      throw new Error("No se pudieron guardar los settings");
  }

  async deleteSettings(userId: number): Promise<void> {
    const res = await axios.delete(`${this.uri}/settings/${userId}`, {
      headers: getAuthHeaders(),
    });
    if (res.status !== 200 && res.status !== 204)
      throw new Error("No se pudieron borrar los settings");
  }
}
