import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api"; // Ajusta según tu backend

// Helper para obtener el token del localStorage
function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const CommentService = {
  async getCommentsByPost(postId: number) {
    const res = await axios.get(`${API_URL}/comments/post/${postId}`, {
      headers: getAuthHeaders(),
    });
    return res.data;
  },

  async createComment(commentDTO: any) {
    const res = await axios.post(`${API_URL}/comments/create`, commentDTO, {
      headers: getAuthHeaders(),
    });
    return res.data;
  },

  async deleteComment(commentId: number) {
    await axios.delete(`${API_URL}/comments/${commentId}`, {
      headers: getAuthHeaders(),
    });
  },

  async updateComment(commentId: number, commentDTO: any) {
    const res = await axios.put(
      `${API_URL}/comments/${commentId}`,
      commentDTO,
      {
        headers: getAuthHeaders(),
      }
    );
    return res.data;
  },
};

export default CommentService;
