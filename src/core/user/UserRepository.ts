import axios from "axios";
import { getAuthHeaders } from "../auth/AuthHeaders";
import IUser from "./IUser";
import IUserDTO from "./IUserDTO";

export class UserRepository {
  uri: string = import.meta.env.VITE_API_ENDPOINT_USERS;

  async getAll(): Promise<IUser[]> {
    const res = await axios.get(this.uri, { headers: getAuthHeaders() });
    return res.data;
  }

  async getById(id: number): Promise<IUser> {
    const res = await axios.get(`${this.uri}/${id}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  }

  async create(user: IUserDTO): Promise<IUser> {
    const res = await axios.post(this.uri, user, { headers: getAuthHeaders() });
    return res.data;
  }

  async update(id: number, user: IUserDTO): Promise<IUser> {
    const res = await axios.put(`${this.uri}/${id}`, user, {
      headers: getAuthHeaders(),
    });
    return res.data;
  }

  async delete(id: number): Promise<void> {
    await axios.delete(`${this.uri}/${id}`, { headers: getAuthHeaders() });
  }

  async register(user: IUserDTO): Promise<IUser> {
    // No enviar headers de autenticación para registro - el usuario aún no tiene token
    const res = await axios.post(`${this.uri}/register`, user);
    return res.data;
  }
}
