import axios from "axios";
import { getAuthHeaders } from "../auth/AuthHeaders";

export default class EventService {
  // ...existing code...

  // Asociar tags a un evento existente
  async associateTagsToEvent(eventId: number, tags: { name: string }[]) {
    const url = `${import.meta.env.VITE_API_ENDPOINT_EVENTS}/${eventId}/tags`;
    return axios.post(url, { tags }, { headers: getAuthHeaders() });
  }
}
