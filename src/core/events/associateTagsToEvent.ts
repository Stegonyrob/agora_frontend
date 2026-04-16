import axios from "axios";
import { getAuthHeaders } from "../auth/AuthHeaders";

export default class EventService {
  // ...existing code...

  // Asociar tags a un evento existente
  // ✅ URL CORREGIDA: usar endpoint de tags, no de eventos
  // Backend pattern: /api/v1/any/tags/events/{eventId}/tags
  async associateTagsToEvent(eventId: number, tags: { name: string }[]) {
    const url = `${
      import.meta.env.VITE_API_ENDPOINT_GENERAL
    }/any/tags/events/${eventId}/tags`;
    return axios.post(url, { tags }, { headers: getAuthHeaders() });
  }
}
