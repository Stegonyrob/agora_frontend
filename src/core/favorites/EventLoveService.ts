import axios from "axios";
import { getAuthHeaders } from "../auth/AuthHeaders";
import { LoveRepository } from "./LoveRepository";

export default class EventLoveService extends LoveRepository {
  constructor() {
    super(import.meta.env.VITE_API_ENDPOINT_EVENTS);
  }

  /**
   * Dar love a un evento como usuario registrado
   * @param eventId ID del evento
   * @param profileId ID del perfil del usuario
   */
  async giveLoveRegistered(eventId: number, profileId: number): Promise<void> {
    await axios.put(
      `${this.uri}/${eventId}/love?profileId=${profileId}`,
      null,
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Dar love a un evento como usuario anónimo
   * @param eventId ID del evento
   */
  async giveLoveAnonymous(eventId: number): Promise<void> {
    await axios.put(`${this.uri}/${eventId}/love-anon`, null, {
      headers: getAuthHeaders(),
    });
  }

  /**
   * Quitar love a un evento como usuario registrado
   * @param eventId ID del evento
   * @param profileId ID del perfil del usuario
   */
  async removeLoveRegistered(
    eventId: number,
    profileId: number
  ): Promise<void> {
    await axios.put(
      `${this.uri}/${eventId}/unlove?profileId=${profileId}`,
      null,
      { headers: getAuthHeaders() }
    );
  }

  /**
   * Quitar love a un evento como usuario anónimo
   * @param eventId ID del evento
   */
  async removeLoveAnonymous(eventId: number): Promise<void> {
    await axios.put(`${this.uri}/${eventId}/unlove-anon`, null, {
      headers: getAuthHeaders(),
    });
  }
}
