import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getAuthHeaders } from "../../auth/AuthHeaders";
import { TextImageResponse, TextImageUploadResponse } from "./ITextImage";

export default class TextImageService {
  private uri: string =
    import.meta.env.VITE_API_ENDPOINT_TEXT_IMAGES ||
    "http://localhost:8080/api/v1/text-images";

  // 🔧 HELPER: Validar calidad de imagen
  private validateImageData(img: TextImageResponse): {
    isValid: boolean;
    quality: "excellent" | "good" | "acceptable" | "poor" | "corrupted";
    estimatedSizeKB: number;
    recommendation: string;
  } {
    const imageDataLength = img.imageData?.length || 0;
    const estimatedSizeKB =
      Math.round(((imageDataLength * 3) / 4 / 1024) * 100) / 100;

    if (imageDataLength === 0) {
      return {
        isValid: false,
        quality: "corrupted",
        estimatedSizeKB: 0,
        recommendation: "Use endpoint URL - no imageData available",
      };
    }

    if (imageDataLength < 1000) {
      return {
        isValid: false,
        quality: "corrupted",
        estimatedSizeKB,
        recommendation:
          "Use endpoint URL - imageData too small, likely corrupted",
      };
    }

    if (imageDataLength < 5000) {
      return {
        isValid: true,
        quality: "poor",
        estimatedSizeKB,
        recommendation: "Consider using endpoint URL for better quality",
      };
    }

    if (imageDataLength < 20000) {
      return {
        isValid: true,
        quality: "acceptable",
        estimatedSizeKB,
        recommendation: "OK for thumbnails, imageData usable",
      };
    }

    if (imageDataLength < 50000) {
      return {
        isValid: true,
        quality: "good",
        estimatedSizeKB,
        recommendation: "Good quality, imageData preferred",
      };
    }

    return {
      isValid: true,
      quality: "excellent",
      estimatedSizeKB,
      recommendation: "Excellent quality, imageData preferred",
    };
  }

  // Upload images to text
  async uploadTextImages(
    textId: number,
    imageFiles: File[]
  ): Promise<TextImageUploadResponse[]> {
    console.log(
      `📤 TextImageService - uploadTextImages iniciado para textId: ${textId}`
    );
    console.log(
      `📤 TextImageService - Archivos a subir:`,
      imageFiles.map((f) => ({ name: f.name, size: f.size, type: f.type }))
    );

    if (!textId) {
      throw new Error("Text ID is required for image upload");
    }

    if (!imageFiles || imageFiles.length === 0) {
      console.log("⚠️ TextImageService - No hay archivos para subir");
      return [];
    }

    const formData = new FormData();

    // Agregar archivos al FormData (coincide exactamente con la documentación del backend)
    Array.from(imageFiles).forEach((file) => {
      formData.append("files", file);
    });
    formData.append("textId", textId.toString());

    console.log(`🔗 TextImageService - POST Request to: ${this.uri}/upload`);
    console.log(`📋 TextImageService - FormData content:`, {
      textId: textId.toString(),
      filesCount: imageFiles.length,
    });

    const config: AxiosRequestConfig = {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data",
      },
      timeout: 30000,
    };

    try {
      const response: AxiosResponse<TextImageUploadResponse[]> =
        await axios.post(`${this.uri}/upload`, formData, config);

      console.log(`✅ TextImageService - Upload exitoso:`, response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        "❌ TextImageService - Error uploading text images:",
        error
      );
      throw new Error(`Error uploading text images: ${error.message}`);
    }
  }

  // Get all images for a text
  async getTextImages(textId: number): Promise<TextImageResponse[]> {
    if (!textId) {
      throw new Error("Text ID is required");
    }

    console.log(`🔍 TextImageService - Getting images for text ID: ${textId}`);
    console.log(
      `🔗 TextImageService - Request URL: ${this.uri}/text/${textId}`
    );

    try {
      const response: AxiosResponse<TextImageResponse[]> = await axios.get(
        `${this.uri}/text/${textId}`,
        { headers: getAuthHeaders() }
      );

      // === DOCUMENTACIÓN DETALLADA DE RESPUESTA DE IMÁGENES ===
      console.log(
        `🖼️ === ANÁLISIS DETALLADO DE IMÁGENES PARA TEXTO ${textId} ===`
      );
      console.log(`📡 Response Status: ${response.status}`);
      console.log(`📡 Response StatusText: ${response.statusText}`);
      console.log(`📡 Response Data:`, response.data);
      console.log(
        `📊 TextImageService - Found ${response.data.length} images for text ${textId}`
      );

      if (response.data.length === 0) {
        console.log(`❌ === NO HAY IMÁGENES PARA TEXTO ${textId} ===`);
        console.log(`   📌 Backend retornó array vacío: []`);
        console.log(`   � Status Code: ${response.status}`);
        console.log(`   📌 Request URL: ${this.uri}/text/${textId}`);
        console.log(`   📌 Posibles causas:`);
        console.log(
          `      - No existen registros en tabla text_images para textId=${textId}`
        );
        console.log(`      - Error en la consulta del backend`);
        console.log(`      - Filtros en el backend que excluyen las imágenes`);
        console.log(`      - Backend configurado incorrectamente`);
      } else {
        // Log detallado de cada imagen
        response.data.forEach((img, index) => {
          console.log(`📸 === IMAGEN ${index + 1} PARA TEXTO ${textId} ===`);
          console.log(`   📌 ID de imagen: ${img.id}`);
          console.log(`   📌 textId: ${img.textId}`);
          console.log(`   📌 imageName: "${img.imageName}"`);
          console.log(`   📌 imageType: "${img.imageType}"`);
          console.log(`   📌 createdAt: "${img.createdAt}"`);
          console.log(`   📌 Tiene imageData: ${!!img.imageData}`);
          console.log(
            `   📌 Longitud imageData: ${img.imageData?.length || 0} caracteres`
          );

          // 🔍 USAR VALIDACIÓN MEJORADA
          const validation = this.validateImageData(img);
          console.log(`   🔍 === ANÁLISIS DE CALIDAD DE IMAGEN ===`);
          console.log(`   📊 Calidad: ${validation.quality.toUpperCase()}`);
          console.log(
            `   📏 Tamaño estimado: ${validation.estimatedSizeKB} KB`
          );
          console.log(`   ✅ Es válida: ${validation.isValid}`);
          console.log(`   💡 Recomendación: ${validation.recommendation}`);

          // Logging por nivel de calidad
          if (validation.quality === "corrupted") {
            console.error(`   ❌ IMAGEN CORRUPTA O EXTREMADAMENTE PEQUEÑA`);
          } else if (validation.quality === "poor") {
            console.warn(`   ⚠️ IMAGEN DE CALIDAD POBRE`);
          } else if (validation.quality === "acceptable") {
            console.log(`   � IMAGEN DE CALIDAD ACEPTABLE`);
          } else {
            console.log(`   ✅ IMAGEN DE BUENA CALIDAD`);
          }

          if (img.imageData) {
            console.log(
              `   📌 imageData (primeros 100 chars): "${img.imageData.substring(
                0,
                100
              )}..."`
            );
            console.log(
              `   📌 imageData tipo detectado: ${
                img.imageData.startsWith("data:")
                  ? "Data URL completa"
                  : "Base64 sin prefijo"
              }`
            );

            // Verificar formato base64
            const cleanBase64 = img.imageData.replace(
              /^data:image\/[^;]+;base64,/,
              ""
            );
            const isValidBase64 = /^[A-Za-z0-9+/=]*$/.test(cleanBase64);
            console.log(`   📋 Base64 válido: ${isValidBase64}`);

            if (!isValidBase64) {
              console.error(`   ❌ BASE64 INVÁLIDO - datos corruptos`);
            }
          } else {
            console.log(`   📌 imageData: null/undefined`);
          }

          console.log(`   📌 OBJETO IMAGEN COMPLETO:`, img);
          console.log("   ─────────────────────────────────────");
        });
      }

      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.warn(
          `⚠️ TextImageService - No images found for text ${textId} (404)`
        );
        return []; // No images found
      }
      console.error(
        `❌ TextImageService - Error fetching images for text ${textId}:`,
        error.message
      );
      throw new Error(`Error fetching text images: ${error.message}`);
    }
  }

  // Delete single image
  async deleteTextImage(imageId: number): Promise<void> {
    if (!imageId) {
      throw new Error("Image ID is required");
    }

    try {
      await axios.delete(`${this.uri}/${imageId}`, {
        headers: getAuthHeaders(),
        timeout: 10000,
      });
    } catch (error: any) {
      console.error("Error deleting text image:", error.message);
      throw new Error(`Error deleting text image: ${error.message}`);
    }
  }

  // Delete multiple images
  async deleteMultipleTextImages(ids: number[]): Promise<void> {
    const url = `${this.uri}/delete-multiple`;

    if (!ids || ids.length === 0) {
      return;
    }

    try {
      console.log(
        `🗑️ TextImageService - Attempting to delete images with IDs:`,
        ids
      );
      // Axios requires the body for a DELETE request to be in the `data` property.
      // The backend endpoint expects a JSON object like: { "imageIds": [1, 2, 3] }
      await axios.delete(url, {
        headers: getAuthHeaders(),
        data: { imageIds: ids },
      });
      console.log(
        `✅ TextImageService - Images with IDs ${ids.join(
          ", "
        )} deleted successfully.`
      );
    } catch (error: any) {
      console.error("Error deleting multiple images:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage = `Server error (${error.response?.status}): ${
          error.response?.data?.message || error.message
        }`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }
      throw new Error("An unexpected error occurred while deleting images.");
    }
  }

  // Build image URL for direct access
  buildImageUrl(imageId: number): string {
    if (!imageId) return "";
    return `${this.uri}/${imageId}/data`;
  }

  // Get image as Blob
  async getImageAsBlob(imageId: number): Promise<string> {
    const response: AxiosResponse<Blob> = await axios.get(
      `${this.uri}/${imageId}/data`,
      {
        responseType: "blob",
        headers: getAuthHeaders(), // Include authorization headers
      }
    );
    return URL.createObjectURL(response.data);
  }
}
