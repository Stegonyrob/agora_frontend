import axios from "axios";
import { getAuthHeaders } from "../auth/AuthHeaders";
import type { IAdmin, IAdminDTO } from "./IAdmin";

export class AdminRepository {
  createUri: string = import.meta.env.VITE_API_ENDPOINT_ADMIN_CREATE;
  profileUri: string = import.meta.env.VITE_API_ENDPOINT_ADMIN_PROFILE;

  /**
   * Obtener todos los administradores
   */
  async getAll(): Promise<IAdmin[]> {
    const res = await axios.get(this.createUri, {
      headers: getAuthHeaders(),
    });
    return res.data;
  }

  /**
   * Crear un nuevo administrador
   */
  async create(admin: IAdminDTO): Promise<IAdmin> {
    const res = await axios.post(this.createUri, admin, {
      headers: getAuthHeaders(),
    });
    return res.data;
  }

  /**
   * Obtener datos de un administrador por ID
   */
  async getById(id: number): Promise<IAdmin> {
    const res = await axios.get(`${this.profileUri}/${id}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  }

  /**
   * Actualizar datos de un administrador
   */
  async update(id: number, admin: Partial<IAdminDTO>): Promise<IAdmin> {
    const res = await axios.put(`${this.profileUri}/${id}`, admin, {
      headers: getAuthHeaders(),
    });
    return res.data;
  }

  /**
   * Eliminar un administrador
   */
  async delete(id: number): Promise<void> {
    const res = await axios.delete(`${this.createUri}/${id}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  }
}
