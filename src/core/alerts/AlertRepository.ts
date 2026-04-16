import axios from "axios";
import { getAuthHeaders } from "../auth/AuthHeaders";
import { IAlert } from "./IAlert";
import { IAlertDTO } from "./IAlertDTO";

export class AlertRepository {
  uri: string = import.meta.env.VITE_API_ENDPOINT_ALERTS;

  async getAll(): Promise<IAlert[]> {
    const res = await axios.get(this.uri, { headers: getAuthHeaders() });
    return res.data;
  }

  async getById(id: number): Promise<IAlert> {
    const res = await axios.get(`${this.uri}/${id}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  }

  async create(alert: IAlertDTO): Promise<IAlert> {
    const res = await axios.post(this.uri, alert, {
      headers: getAuthHeaders(),
    });
    return res.data;
  }

  async update(id: number, alert: IAlertDTO): Promise<IAlert> {
    const res = await axios.put(`${this.uri}/${id}`, alert, {
      headers: getAuthHeaders(),
    });
    return res.data;
  }

  async delete(id: number): Promise<void> {
    await axios.delete(`${this.uri}/${id}`, { headers: getAuthHeaders() });
  }
}
