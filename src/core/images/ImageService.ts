// ImageService.ts

class ImageService {
  private apiUrl: string;

  constructor(apiUrl: string) {
    this.apiUrl = apiUrl;
  }

  async deleteOne(imageName: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiUrl}/${imageName}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Error deleting image: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Failed to delete image:", error);
      throw error;
    }
  }

  async uploadImages(
    formData: FormData
  ): Promise<{ success: boolean; url: string; error?: string }> {
    try {
      if (!formData) {
        throw new Error(
          "No se ha proporcionado un formulario para subir la imagen."
        );
      }

      const response = await fetch(`${this.apiUrl}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error al subir la imagen: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data || !data.url) {
        throw new Error("No se ha recibido una respuesta válida del servidor.");
      }

      return { success: true, url: data.url };
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      return { success: false, url: "", error: (error as Error).message };
    }
  }
}

export default ImageService;
