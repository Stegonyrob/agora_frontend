// replies.api.ts
import axios from "axios";
import { getUserRole } from "../services/users.api";
// Index:

// 1. Fetch Replies - fetchReplies()
// 2. Create Reply - createReply()
// 3. Update Reply - updateReply()
// 4. Delete Reply - deleteReply()

// Environment Variables for API Endpoints
const uri4 = import.meta.env.VITE_API_ENDPOINT_REPLIES;

// 1. Fetch Replies - Allows admins to fetch replies by post ID
async function fetchReplies(postId: string): Promise<any[]> {
  const userRole = await getUserRole();
  if (userRole !== "admin") {
    throw new Error("Only admin can fetch replies");
  }
  try {
    const response = await axios.get(`${uri4}/${postId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching replies: ", error);
    throw error;
  }
}

// 2. Create Reply - Allows admins and users to create replies
async function createReply(postId: string, replyData: any): Promise<any> {
  const userRole = await getUserRole();
  if (userRole !== "admin" && userRole !== "user") {
    throw new Error("Only admin or user can create replies");
  }
  try {
    const response = await axios.post(`${uri4}/${postId}`, replyData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating reply:", error);
    throw error;
  }
}

// 3. Update Reply - Allows owners or admins to update replies
async function updateReply(replyId: string, replyData: any): Promise<any> {
  const userRole = await getUserRole();
  if (userRole !== "admin" && userRole !== "user") {
    throw new Error("Only admin or user can update replies");
  }
  try {
    const response = await axios.put(`${uri4}/${replyId}`, replyData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating reply:", error);
    throw error;
  }
}

// 4. Delete Reply - Allows creators or admins to delete replies
async function deleteReply(replyId: string): Promise<void> {
  const userRole = await getUserRole();
  if (userRole !== "admin" && userRole !== "user") {
    throw new Error("Only admin or user can delete replies");
  }
  try {
    await axios.delete(`${uri4}/${replyId}`, {
      withCredentials: true,
    });
    console.log("Reply deleted successfully.");
  } catch (error) {
    console.error("Error deleting reply:", error);
    throw error;
  }
}

export { createReply, fetchReplies, updateReply };
