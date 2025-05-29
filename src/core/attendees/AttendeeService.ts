import axios from "axios";

//1-registerAttendee
//2-getAttendees
//3-getAttendee
//4-updateAttendee
//5-deleteAttendee

const BASE_URL = import.meta.env.VITE_API_ENDPOINT_ATTENDEES; // Ej: http://localhost:8080/api/v1/attendees

//1-registerAttendee

export default class AttendeeService {
  async registerAttendee(
    eventId: number,
    attendee: { name: string; email: string; phone: string },
    captchaToken: string
  ) {
    const response = await axios.post(
      `${BASE_URL}/${eventId}?captchaToken=${captchaToken}`,
      attendee,
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  }

  //2-getAttendees

  async getAttendees(eventId: number) {
    const response = await axios.get(`${BASE_URL}/${eventId}`);
    return response.data;
  }
  //3-getAttendee

  async getAttendee(eventId: number, attendeeId: number) {
    const response = await axios.get(`${BASE_URL}/${eventId}/${attendeeId}`);
    return response.data;
  }
  //4-updateAttendee

  async updateAttendee(
    eventId: number,
    attendeeId: number,
    attendee: { name: string; email: string; phone: string }
  ) {
    const response = await axios.put(
      `${BASE_URL}/${eventId}/${attendeeId}`,
      attendee,
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  }
  //5-deleteAttendee
  async deleteAttendee(eventId: number, attendeeId: number) {
    const response = await axios.delete(`${BASE_URL}/${eventId}/${attendeeId}`);
    return response.data;
  }
}
