import axios from "axios";

//1-getAttendees
//2-registerAttendee
//3-deleteAttendee
//4-verifyRecaptcha
const API_URL = import.meta.env.VITE_API_ENDPOINT_ATTENDEES; // Ej: http://localhost:8080/api/v1/attendees

//1-getAttendees

class AttendeeService {
  async getAttendees(eventId: number): Promise<any[]> {
    try {
      const response = await axios.get(`${API_URL}/${eventId}`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching attendees:", error);
      throw error;
    }
  }
  //2-registerAttendee
  async registerAttendee(
    eventId: number,
    attendeeData: any,
    recaptchaScore: string
  ): Promise<any> {
    try {
      const response = await axios.post(`${API_URL}/${eventId}`, {
        ...attendeeData,
        recaptchaScore,
      });
      return response.data;
    } catch (error: any) {
      console.error("Error registering attendee:", error);
      throw error;
    }
  }
  //3-deleteAttendee
  async deleteAttendee(eventId: number, attendeeId: number): Promise<void> {
    try {
      await axios.delete(`${API_URL}/${eventId}/${attendeeId}`);
    } catch (error: any) {
      console.error("Error deleting attendee:", error);
      throw error;
    }
  }

  //4-verifyRecaptcha
  async verifyRecaptcha(token: string): Promise<number> {
    try {
      const response = await axios.post(`${API_URL}/recaptcha/verify`, {
        token,
      });
      return response.data.score;
    } catch (error: any) {
      console.error("Error verifying ReCAPTCHA:", error);
      throw error;
    }
  }
}

export default AttendeeService;
