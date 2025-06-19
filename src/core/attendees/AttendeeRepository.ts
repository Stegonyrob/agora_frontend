import axios from "axios";
import { getAuthHeaders } from "../auth/AuthHeaders";
import { IAttendee } from "./IAttendee";
import { IAttendeeDTO } from "./IAttendeeDTO";

export class AttendeeRepository {
  uri: string = import.meta.env.VITE_API_ENDPOINT_ATTENDEES;

  async getAll(eventId: number): Promise<IAttendee[]> {
    const res = await axios.get(`${this.uri}/${eventId}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  }

  async register(eventId: number, attendee: IAttendeeDTO): Promise<IAttendee> {
    const res = await axios.post(`${this.uri}/${eventId}`, attendee, {
      headers: getAuthHeaders(),
    });
    return res.data;
  }

  async delete(eventId: number, attendeeId: number): Promise<void> {
    await axios.delete(`${this.uri}/${eventId}/${attendeeId}`, {
      headers: getAuthHeaders(),
    });
  }

  async verifyRecaptcha(token: string): Promise<number> {
    const res = await axios.post(`${this.uri}/recaptcha/verify`, { token });
    return res.data.score;
  }
}
