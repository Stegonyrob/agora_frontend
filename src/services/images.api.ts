// images.api.ts
import axios from "axios";
import { getUserRole } from "./users.api";

// Index:

// 1. Fetch Images - fetchImages()
// 2. Upload Images - uploadImages()
// 3. Delete Images - deleteImages()

// Environment Variables for API Endpoints
const uri5 = import.meta.env.VITE_API_ENDPOINT_IMAGES;

// 1. Fetch Images - Allows admins to fetch images by post ID
async function fetchImages(postId: string): Promise<any[]> {
  const userRole = await getUserRole();
  if (userRole !== "admin") {
    throw new Error("Only admin can fetch images");
  }
  try {
    const response = await axios.get(`${uri5}/getAsResource/${postId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching images: ", error);
    throw error;
  }
}

// 2. Upload Images - Allows users to upload images for their profiles
async function uploadImages(postId: string, imageData: FormData): Promise<any> {
  const userRole = await getUserRole();
  if (userRole !== "admin" && userRole !== "user") {
    throw new Error("Only admin or user can upload images");
  }
  try {
    const response = await axios.post(
      `${uri5}/uploadImages/${postId}`,
      imageData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
}

// 3. Delete Images - Allows users to delete their own images or admins to delete any image
async function deleteImages(filename: string): Promise<void> {
  const userRole = await getUserRole();
  if (userRole !== "admin") {
    throw new Error("Only admin can delete images");
  }
  try {
    await axios.delete(`${uri5}/${filename}`, {
      withCredentials: true,
    });
    console.log("Image deleted successfully.");
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
}

export { deleteImages, fetchImages, uploadImages };
