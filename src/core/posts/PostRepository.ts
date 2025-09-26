import axios from "axios";
import { getAuthHeaders } from "../auth/AuthHeaders";
import {
  normalizeArray,
  normalizeItem,
} from "../normalization/normalizeApiResponse";
import { IPost } from "./IPost";
import { IPostDTO } from "./IPostDTO";

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // página actual
  size: number;
}

export default class PostRepository {
  uri: string = import.meta.env.VITE_API_ENDPOINT_POSTS;
  // Obtener todos los posts paginados
  async getAll(page = 0, size = 10): Promise<Page<IPost>> {
    const url = `${this.uri}?page=${page}&size=${size}`;
    const response = await axios.get(url, {
      headers: getAuthHeaders(),
    });

    // Debug: mostrar la respuesta cruda del backend antes de normalizar
    console.log("🔍 [PostRepository] Raw backend response:", {
      url,
      totalElements: response.data.totalElements,
      totalContent: response.data.content?.length || 0,
      fullResponse: response.data,
    });

    // Debug: analizar cada post individualmente
    if (response.data.content && response.data.content.length > 0) {
      console.log("📊 [PostRepository] Detailed post analysis:");
      response.data.content.forEach((post: any, index: number) => {
        console.log(`📝 [PostRepository] Post ${index + 1}:`, {
          id: post.id,
          title: post.title,
          hasImage: "image" in post,
          hasImages: "images" in post,
          imageValue: post.image,
          imagesValue: post.images,
          imageType: typeof post.image,
          imagesType: typeof post.images,
          allFields: Object.keys(post),
          completePost: post,
        });
      });
    } else {
      console.log("❌ [PostRepository] No posts found in response");
    }

    // Normalizar los posts en la página
    const normalizedContent = normalizeArray(response.data.content).map((p) =>
      normalizeItem(p)
    );

    // Debug: mostrar el resultado después de la normalización
    console.log("🔧 [PostRepository] After normalization:", {
      originalLength: response.data.content?.length || 0,
      normalizedLength: normalizedContent.length,
      normalizedSample: normalizedContent[0]
        ? {
            id: normalizedContent[0].id,
            title: normalizedContent[0].title,
            hasImage: "image" in normalizedContent[0],
            hasImages: "images" in normalizedContent[0],
            imageValue: normalizedContent[0].image,
            imagesValue: normalizedContent[0].images,
            imageType: typeof normalizedContent[0].image,
            imagesType: typeof normalizedContent[0].images,
            allFields: Object.keys(normalizedContent[0]),
          }
        : "No normalized posts",
    });

    return {
      ...response.data,
      content: normalizedContent,
    };
  }

  // Obtener un post por ID
  async getById(id: number): Promise<IPost> {
    const response = await axios.get(`${this.uri}/${id}`, {
      headers: getAuthHeaders(),
    });
    return normalizeItem(response.data);
  }

  // Crear un post (solo admin)
  async create(post: IPostDTO): Promise<IPost> {
    console.log(
      "🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨\n🔥🔥🔥 [PostRepository][CREATE] MÉTODO EJECUTADO 🔥🔥🔥\n🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨"
    );
    console.log(
      "[PostRepository][CREATE] Payload enviado:",
      JSON.stringify(post, null, 2)
    );
    const response = await axios.post(this.uri, post, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    });
    console.log("[PostRepository][CREATE] Respuesta recibida:", response);
    return response.data;
  }

  // Actualizar un post (solo admin)
  async update(postId: number, post: IPostDTO): Promise<IPost> {
    const response = await axios.put(`${this.uri}/${postId}`, post, {
      headers: getAuthHeaders(),
    });
    return response.data;
  }

  // Eliminar un post (solo admin)
  async delete(postId: number): Promise<void> {
    await axios.delete(`${this.uri}/${postId}`, { headers: getAuthHeaders() });
  }

  // Archivar/desarchivar un post (solo admin)
  async archive(postId: number, archive: boolean): Promise<void> {
    await axios.patch(
      `${this.uri}/${postId}/archive?archive=${archive}`,
      null,
      { headers: getAuthHeaders() }
    );
  }
}
