import axios from "axios";
import { getAuthHeaders } from "../auth/AuthHeaders";
import IUser from "./IUser";
import IUserDTO from "./IUserDTO";

export class UserRepository {
  uri: string = import.meta.env.VITE_API_ENDPOINT_USERS;
  adminUri: string = import.meta.env.VITE_API_ENDPOINT_USERS.replace(
    "/any/",
    "/admin/"
  );

  async getAll(): Promise<IUser[]> {
    console.log(`🔗 UserRepository.getAll - GET to: ${this.uri}`);
    try {
      const res = await axios.get(this.uri, { headers: getAuthHeaders() });
      console.log(`✅ UserRepository.getAll - Respuesta recibida:`, res.data);
      console.log(
        `🔍 UserRepository.getAll - Tipo de datos:`,
        typeof res.data,
        Array.isArray(res.data)
      );
      return res.data;
    } catch (error) {
      console.error(`❌ UserRepository.getAll - Error en GET:`, error);
      throw error;
    }
  }

  async getById(id: number): Promise<IUser> {
    const res = await axios.get(`${this.uri}/${id}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  }

  async create(user: IUserDTO): Promise<IUser> {
    console.log(`➕ UserRepository.create - POST to: ${this.adminUri}`);
    console.log(`📤 UserRepository.create - Datos enviados:`, user);
    try {
      const res = await axios.post(this.adminUri, user, {
        headers: getAuthHeaders(),
      });
      console.log(`✅ UserRepository.create - Respuesta recibida:`, res.data);
      return res.data;
    } catch (error) {
      console.error(`❌ UserRepository.create - Error en POST:`, error);
      if (axios.isAxiosError(error) && error.response) {
        console.error(
          `❌ UserRepository.create - Respuesta del servidor:`,
          error.response.data
        );
        console.error(
          `❌ UserRepository.create - Status:`,
          error.response.status
        );
      }
      throw error;
    }
  }

  async update(id: number, user: IUserDTO): Promise<IUser> {
    console.log(`🔄 UserRepository.update - PUT to: ${this.adminUri}/${id}`);
    console.log(`📤 UserRepository.update - Datos enviados:`, user);
    try {
      const res = await axios.put(`${this.adminUri}/${id}`, user, {
        headers: getAuthHeaders(),
      });
      console.log(`✅ UserRepository.update - Respuesta recibida:`, res.data);
      return res.data;
    } catch (error) {
      console.error(`❌ UserRepository.update - Error en PUT:`, error);
      if (axios.isAxiosError(error) && error.response) {
        console.error(
          `❌ UserRepository.update - Respuesta del servidor:`,
          error.response.data
        );
        console.error(
          `❌ UserRepository.update - Status:`,
          error.response.status
        );
      }
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    console.log(`🗑️ UserRepository.delete - DELETE to: ${this.adminUri}/${id}`);
    console.log(
      `🔑 UserRepository.delete - Headers enviados:`,
      getAuthHeaders()
    );
    try {
      await axios.delete(`${this.adminUri}/${id}`, {
        headers: getAuthHeaders(),
      });
      console.log(`✅ UserRepository.delete - Usuario eliminado exitosamente`);
    } catch (error) {
      console.error(`❌ UserRepository.delete - Error en DELETE:`, error);
      if (axios.isAxiosError(error) && error.response) {
        console.error(
          `❌ UserRepository.delete - Respuesta del servidor:`,
          error.response.data
        );
        console.error(
          `❌ UserRepository.delete - Status:`,
          error.response.status
        );
        console.error(
          `❌ UserRepository.delete - Headers de respuesta:`,
          error.response.headers
        );
      }
      throw error;
    }
  }

  async getByUsername(username: string): Promise<IUser | null> {
    try {
      const res = await axios.get(`${this.uri}/username/${username}`, {
        headers: getAuthHeaders(),
      });
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null; // User not found
      }
      throw error; // Re-throw unexpected errors
    }
  }
}
