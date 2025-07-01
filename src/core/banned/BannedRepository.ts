import axios from "axios";
import { getAuthHeaders } from "../auth/AuthHeaders";
import IBanned from "./IBanned";
import IBannedDTO from "./IBannedDTO";

export class BannedRepository {
  // Usar el endpoint correcto para admin/banned
  private uri: string = import.meta.env.VITE_API_ENDPOINT_BANNED;

  async getAll(): Promise<IBanned[]> {
    console.log(`🔗 BannedRepository.getAll - GET to: ${this.uri}`);
    try {
      const res = await axios.get(this.uri, { headers: getAuthHeaders() });
      console.log(`✅ BannedRepository.getAll - Respuesta recibida:`, res.data);
      return res.data;
    } catch (error) {
      console.error(`❌ BannedRepository.getAll - Error en GET:`, error);
      throw error;
    }
  }

  async getByUserId(userId: number): Promise<IBanned | null> {
    const endpoint = `${this.uri}/user/${userId}`;
    console.log(`🔗 BannedRepository.getByUserId - GET to: ${endpoint}`);
    try {
      const res = await axios.get(endpoint, {
        headers: getAuthHeaders(),
      });
      console.log(
        `✅ BannedRepository.getByUserId - Respuesta recibida:`,
        res.data
      );
      return res.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null; // Usuario no está baneado
      }
      console.error(`❌ BannedRepository.getByUserId - Error en GET:`, error);
      throw error;
    }
  }

  async create(bannedData: IBannedDTO): Promise<IBanned> {
    const userId = bannedData.userId;
    const endpoint = `${this.uri}/user/${userId}`;
    console.log(`➕ BannedRepository.create - POST to: ${endpoint}`);
    // Solo enviar la razón en el body, no todo el objeto bannedData
    const payload = { reason: bannedData.reason };
    console.log(`📤 BannedRepository.create - Datos enviados:`, payload);
    try {
      const res = await axios.post(endpoint, payload, {
        headers: getAuthHeaders(),
      });
      console.log(`✅ BannedRepository.create - Respuesta recibida:`, res.data);
      return res.data;
    } catch (error) {
      console.error(`❌ BannedRepository.create - Error en POST:`, error);
      if (axios.isAxiosError(error) && error.response) {
        console.error(
          `❌ BannedRepository.create - Respuesta del servidor:`,
          error.response.data
        );
        console.error(
          `❌ BannedRepository.create - Status:`,
          error.response.status
        );
      }
      throw error;
    }
  }

  async update(id: number, bannedData: IBannedDTO): Promise<IBanned> {
    console.log(`🔄 BannedRepository.update - PUT to: ${this.uri}/${id}`);
    console.log(`📤 BannedRepository.update - Datos enviados:`, bannedData);
    try {
      const res = await axios.put(`${this.uri}/${id}`, bannedData, {
        headers: getAuthHeaders(),
      });
      console.log(`✅ BannedRepository.update - Respuesta recibida:`, res.data);
      return res.data;
    } catch (error) {
      console.error(`❌ BannedRepository.update - Error en PUT:`, error);
      if (axios.isAxiosError(error) && error.response) {
        console.error(
          `❌ BannedRepository.update - Respuesta del servidor:`,
          error.response.data
        );
        console.error(
          `❌ BannedRepository.update - Status:`,
          error.response.status
        );
      }
      throw error;
    }
  }

  async delete(userId: number): Promise<void> {
    const endpoint = `${this.uri}/user/${userId}`;
    console.log(`🗑️ BannedRepository.delete - DELETE to: ${endpoint}`);
    try {
      await axios.delete(endpoint, { headers: getAuthHeaders() });
      console.log(`✅ BannedRepository.delete - Baneo eliminado exitosamente`);
    } catch (error) {
      console.error(`❌ BannedRepository.delete - Error en DELETE:`, error);
      if (axios.isAxiosError(error) && error.response) {
        console.error(
          `❌ BannedRepository.delete - Respuesta del servidor:`,
          error.response.data
        );
        console.error(
          `❌ BannedRepository.delete - Status:`,
          error.response.status
        );
      }
      throw error;
    }
  }
}
