// import axios from "axios";
// import { useSelector } from "react-redux";
// import { PostDTO } from "../dto/post.dto";
// import { RootState } from "../redux/store";
// import { Post } from "../types/types";
// import { getUserRole } from "./users.api";

// // Environment Variables for API Endpoints
// const uri2 = import.meta.env.VITE_API_ENDPOINT_USERS_POSTS;
// const uri3 = import.meta.env.VITE_API_ENDPOINT_ADMIN_POSTS;

// interface PostData {
//   title: string;
//   message: string;
//   creationDate?: string;
// }

// const apiPost = {
//   // Fetch Posts - Retrieves posts visible to both users and admins
//   async fetchPosts(): Promise<Post[]> {
//     try {
//       console.log("Fetching posts request to:", `${uri2}`);
//       const response = await axios.get(`${uri2}`);
//       console.log("Response:", response);
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching posts: ", error);
//       throw error;
//     }
//   },

//   // Create Post - Allows only admins to create posts
//   async createPost(
//     postData: PostData,
//     role: string,
//     isAuthenticated: boolean
//   ): Promise<Post> {
//     if (!isAuthenticated) {
//       throw new Error("Only admin can create posts");
//     }

//     const userRole = useSelector((state: RootState) => state.auth.role);
//     if (userRole !== "ADMIN") {
//       throw new Error("Only admin can create posts");
//     }

//     const postDTO = new PostDTO(
//       postData.title,
//       postData.message,
//       postData.creationDate
//     );

//     try {
//       const response = await axios.post(`${uri3}`, postDTO, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       console.log(uri3);

//       if (!response || !response.data) {
//         throw new Error("Error creating post");
//       }

//       return response.data;
//     } catch (error) {
//       console.error("Error creating post:", error);
//       throw error;
//     }
//   },

//   // Update Post - Allows only admins to edit posts
//   async updatePost(postId: string, postData: PostData): Promise<Post> {
//     const userRole = await getUserRole();
//     if (userRole !== "admin") {
//       throw new Error("Only admin can update posts");
//     }

//     const postDTO = new PostDTO(
//       postData.title,
//       postData.message,
//       postData.creationDate
//     );

//     try {
//       const response = await axios.put(`${uri3}/${postId}`, postDTO, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//         withCredentials: true,
//       });

//       if (!response.data) {
//         throw new Error("Error al actualizar el post");
//       }

//       return response.data;
//     } catch (error) {
//       console.error("Error al actualizar el post:", error);
//       throw error;
//     }
//   },

//   // Delete Post - Allows only admins to delete posts
//   async deletePost(postId: string): Promise<void> {
//     const userRole = await getUserRole();
//     if (userRole !== "admin") {
//       throw new Error("Only admin can delete posts");
//     }

//     try {
//       await axios.delete(`${uri3}/${postId}`, {
//         withCredentials: true,
//       });
//     } catch (error) {
//       console.error("Error al eliminar el post:", error);
//       throw error;
//     }
//   },
// };

// export default apiPost;

import axios from "axios";
import { PostDTO } from "../dto/post.dto";
import { Post } from "../types/types";
import { getUserRole } from "./users.api";

// Environment Variables for API Endpoints
const uri2 = import.meta.env.VITE_API_ENDPOINT_USERS_POSTS;
const uri3 = import.meta.env.VITE_API_ENDPOINT_ADMIN_POSTS;

interface PostData {
  title: string;
  message: string;
  creationDate?: string;
}

// Add JWT Authorization header
const accessToken = () => {
  const token = localStorage.getItem("authToken");
  console.log(localStorage.getItem("authToken"));
  if (!token) {
    throw new Error("No token found in local storage");
  }
  return token;
};

const apiPostInstance = {
  // Fetch Posts  // Fetch Posts

  async fetchPosts(): Promise<Post[]> {
    const token = accessToken();
    console.log(token);
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    console.log("Headers:", headers); // Verificar que se esté configurando correctamente
    try {
      const response = await axios.get(uri2, { headers });
      console.log("Request:", axios.create().get(uri2, { headers }));
      console.log("Response:", response); // Imprimir la respuesta
      return response.data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  },

  // Create Post - Allows only admins to create posts
  async createPost(
    token: string,
    postData: PostData,
    role: string,
    isAuthenticated: boolean
  ): Promise<Post> {
    if (!isAuthenticated) {
      throw new Error("Only admin can create posts");
    }

    if (role !== "ADMIN") {
      throw new Error("Only admin can create posts");
    }

    const postDTO = new PostDTO(
      postData.title,
      postData.message,
      postData.creationDate
    );

    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.post(`${uri3}`, postDTO, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(uri3);

      if (!response || !response.data) {
        throw new Error("Error creating post");
      }

      return response.data;
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  },

  // Update Post - Allows only admins to edit posts
  async updatePost(
    token: string,
    postId: string,
    postData: PostData
  ): Promise<Post> {
    const userRole = await getUserRole();
    if (userRole !== "admin") {
      throw new Error("Only admin can update posts");
    }

    const postDTO = new PostDTO(
      postData.title,
      postData.message,
      postData.creationDate
    );

    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.put(`${uri3}/${postId}`, postDTO, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (!response.data) {
        throw new Error("Error al actualizar el post");
      }

      return response.data;
    } catch (error) {
      console.error("Error al actualizar el post:", error);
      throw error;
    }
  },

  // Delete Post - Allows only admins to delete posts
  async deletePost(token: string, postId: string): Promise<void> {
    const userRole = await getUserRole();
    if (userRole !== "admin") {
      throw new Error("Only admin can delete posts");
    }

    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      await axios.delete(`${uri3}/${postId}`, {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Error al eliminar el post:", error);
      throw error;
    }
  },
};

export default apiPostInstance;
