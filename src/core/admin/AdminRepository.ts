import axios from "axios";
import { getAuthHeaders } from "../auth/AuthHeaders";

import {
  normalizeArray,
  normalizeItem,
} from "../normalization/normalizeApiResponse";
import type { IAdmin } from "./IAdmin";
import type { IAdminDTO } from "./IAdminDTO";

export class AdminRepository {
  // Base URL para todos los endpoints del admin-controller
  private adminBaseUri: string = import.meta.env.VITE_API_ENDPOINT_ADMIN_BASE; // http://localhost:8080/api/v1/admin

  /**
   * GET /api/v1/admin - Obtener todos los administradores
   */
  async getAll(): Promise<IAdmin[]> {
    const res = await axios.get(this.adminBaseUri, {
      headers: getAuthHeaders(),
    });
    // Normaliza el array de admins
    return normalizeArray(res.data).map((a) => normalizeItem<IAdmin>(a));
  }

  /**
   * POST /api/v1/admin/create - Crear un nuevo administrador
   */
  async create(admin: IAdminDTO): Promise<IAdmin> {
    const res = await axios.post(`${this.adminBaseUri}/create`, admin, {
      headers: getAuthHeaders(),
    });
    return normalizeItem<IAdmin>(res.data);
  }

  /**
   * GET /api/v1/admin/{id} - Obtener administrador por ID
   */
  async getById(id: number): Promise<IAdmin> {
    const res = await axios.get(`${this.adminBaseUri}/${id}`, {
      headers: getAuthHeaders(),
    });
    return normalizeItem<IAdmin>(res.data);
  }

  /**
   * PUT /api/v1/admin/{id} - Actualizar administrador
   */
  async update(id: number, admin: Partial<IAdminDTO>): Promise<IAdmin> {
    const res = await axios.put(`${this.adminBaseUri}/${id}`, admin, {
      headers: getAuthHeaders(),
    });
    return normalizeItem<IAdmin>(res.data);
  }

  /**
   * DELETE /api/v1/admin/{id} - Eliminar administrador
   */
  async delete(id: number): Promise<void> {
    const res = await axios.delete(`${this.adminBaseUri}/${id}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  }

  /**
   * POST /api/v1/admin/demote/{id} - Degradar admin a usuario común
   */
  async demoteToUser(id: number): Promise<void> {
    const res = await axios.post(
      `${this.adminBaseUri}/demote/${id}`,
      {},
      {
        headers: getAuthHeaders(),
      }
    );
    return res.data;
  }

  /**
   * GET /api/v1/admin/{id}/2fa-secret - Obtener secreto TOTP para 2FA
   */
  async getTotpSecret(id: number): Promise<string> {
    const res = await axios.get(`${this.adminBaseUri}/${id}/2fa-secret`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  }

  /**
   * POST /api/v1/admin/{id}/2fa-validate - Validar código TOTP para 2FA
   */
  async validateTotp(id: number, code: string): Promise<boolean> {
    const res = await axios.post(
      `${this.adminBaseUri}/${id}/2fa-validate`,
      code,
      {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
      }
    );
    return res.data;
  }
}
