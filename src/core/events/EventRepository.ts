import axios, { AxiosError } from "axios";
import {
  normalizeArray,
  normalizeItem,
} from "../normalization/normalizeApiResponse";
import { IEvent } from "./IEvent";

export default class EventRepository {
  uri: string = import.meta.env.VITE_API_ENDPOINT_EVENTS;

  async getAll(): Promise<IEvent[]> {
    try {
      const response = await axios.get(this.uri);
      // Debug: mostrar la respuesta cruda del backend antes de normalizar
      try {
        console.log(
          "[EventRepository] Raw backend response:",
          JSON.stringify(response.data, null, 2)
        );
      } catch (e) {
        console.log(
          "[EventRepository] Raw backend response (raw):",
          response.data
        );
      }
      // Normalizar todos los eventos
      return normalizeArray(response.data).map((ev) => normalizeItem(ev));
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        console.error("Error API response:", axiosError.response.data);
      } else if (axiosError.request) {
        console.error("No response received:", axiosError.request);
      } else {
        console.error("Request setup error:", axiosError.message);
      }
      throw new Error("Failed to fetch data");
    }
  }
}
