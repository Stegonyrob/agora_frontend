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
    // GET request initiated
    try {
      const res = await axios.get(this.uri, { headers: getAuthHeaders() });
      // Response received successfully
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
    // POST request initiated
    // User data prepared for creation
    try {
      const res = await axios.post(this.adminUri, user, {
        headers: getAuthHeaders(),
      });
      // User created successfully
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
    // PUT request initiated
    // User data prepared for update
    try {
      const res = await axios.put(`${this.adminUri}/${id}`, user, {
        headers: getAuthHeaders(),
      });
      // User updated successfully
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
    // DELETE request initiated
    console.log(
      `🔑 UserRepository.delete - Headers enviados:`,
      getAuthHeaders()
    );
    try {
      await axios.delete(`${this.adminUri}/${id}`, {
        headers: getAuthHeaders(),
      });
      // User deleted successfully
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
