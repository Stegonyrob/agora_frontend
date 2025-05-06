import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ITextItem } from "./ITextItem";
import { ITextItemDTO } from "./ITextItemDTO";

// Index:
// 1. Get all texts - fetchTexts()
// 2. Get text by ID - fetchTextById()
// 3. Create text - createText()
// 4. Update text - updateText()
// 5. Delete text - deleteText()

export default class TextService {
  private uri: string = import.meta.env.VITE_API_ENDPOINT_TEXTS;

  // 1. Get all texts - fetchTexts() (Public)
  async fetchTexts(): Promise<ITextItem[]> {
    console.log("Fetching all texts...");
    try {
      const response: AxiosResponse<ITextItem[]> = await axios.get<ITextItem[]>(
        this.uri,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Texts fetched successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching texts:", error.message);
      throw new Error(`Error fetching texts: ${error.message}`);
    }
  }

  // 2. Get text by ID - fetchTextById() (Public)
  async fetchTextById(id: number): Promise<ITextItem> {
    console.log(`Fetching text by ID: ${id}`);
    try {
      const response: AxiosResponse<ITextItem> = await axios.get<ITextItem>(
        `${this.uri}/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Text fetched successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching text by ID: ${error.message}`);
      throw new Error(`Error fetching text by ID: ${error.message}`);
    }
  }

  // 3. Create text - createText() (Admin Only)
  async createText(newText: ITextItemDTO): Promise<ITextItem> {
    console.log("Creating new text...");
    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    };

    try {
      const response: AxiosResponse<ITextItem> = await axios.post<ITextItem>(
        this.uri,
        newText,
        config
      );
      console.log("Text created successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error creating text:", error.message);
      throw new Error(`Error creating text: ${error.message}`);
    }
  }

  // 4. Update text - updateText() (Admin Only)
  async updateText(id: number, updatedText: ITextItemDTO): Promise<ITextItem> {
    console.log(`Updating text with ID: ${id}`);
    const config: AxiosRequestConfig = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    };

    try {
      const response: AxiosResponse<ITextItem> = await axios.put<ITextItem>(
        `${this.uri}/${id}`,
        updatedText,
        config
      );
      console.log("Text updated successfully:", response.data);
      return response.data;
    } catch (error: any) {
      console.error(`Error updating text with ID ${id}:`, error.message);
      throw new Error(`Error updating text with ID ${id}: ${error.message}`);
    }
  }

  // 5. Delete text - deleteText() (Admin Only)
  async deleteText(id: number): Promise<void> {
    console.log(`Deleting text with ID: ${id}`);
    const config: AxiosRequestConfig = {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
      },
    };

    try {
      await axios.delete(`${this.uri}/${id}`, config);
      console.log("Text deleted successfully.");
    } catch (error: any) {
      console.error(`Error deleting text with ID ${id}:`, error.message);
      throw new Error(`Error deleting text with ID ${id}: ${error.message}`);
    }
  }
}
