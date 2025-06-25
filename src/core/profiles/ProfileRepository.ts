import axios from "axios";
import { getAuthHeaders } from "../auth/AuthHeaders";
import IProfile from "./IProfile";
import IProfileDTO from "./IProfileDTO";

export class ProfileRepository {
  uri: string = import.meta.env.VITE_API_ENDPOINT_PROFILE;

  async getAll(): Promise<IProfile[]> {
    const res = await axios.get(`${this.uri}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  }

  async getById(id: number): Promise<IProfile> {
    const res = await axios.get(`${this.uri}/${id}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  }

  async create(profile: IProfileDTO): Promise<IProfile> {
    const res = await axios.post(`${this.uri}`, profile, {
      headers: getAuthHeaders(),
    });
    return res.data;
  }

  async update(id: number, profile: IProfileDTO): Promise<IProfile> {
    const res = await axios.put(`${this.uri}/${id}`, profile, {
      headers: getAuthHeaders(),
    });
    return res.data;
  }

  async delete(id: number): Promise<void> {
    await axios.delete(`${this.uri}/${id}`, {
      headers: getAuthHeaders(),
    });
  }
}
