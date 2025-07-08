import axios, { AxiosError } from "axios";
import { IEvent } from "./IEvent";

export default class EventRepository {
  uri: string = import.meta.env.VITE_API_ENDPOINT_EVENTS;

  async getAll(): Promise<IEvent[]> {
    try {
      const response = await axios.get(this.uri);
      return response.data;
      console.log(response.data);
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        console.error("Error API response:", axiosError.response.data);
      } else if (axiosError.request) {
        // La solicitud fue realizada pero no se recibió respuesta
        console.error("No response received:", axiosError.request);
      } else {
        // Ocurrió un error durante la configuración de la solicitud
        console.error("Request setup error:", axiosError.message);
      }
      throw new Error("Failed to fetch data");
    }
  }
}
