import axios from "axios";
import { getUserRole } from "../services/users.api";

// Index:

// 1. Profile User - profileUser()
// 2. Get Profile - getProfile()
// 3. Update Profile - updateProfile()
// 4. Delete Profile - deleteProfile()

// Environment Variables for API Endpoints
const uri = import.meta.env.VITE_API_ENDPOINT_GENERAL;

// 1. Profile User - Allows users to register a profile
async function profileUser(userData: {
  avatar: string;
  firstName: string;
  lastName1: string;
  lastName2: string;
  relationship: string;
  email: string;
  city: string;
  userId: string;
}): Promise<any> {
  try {
    const userId = localStorage.getItem("userId");
    const response = await axios.post(`${uri}/users/${userId}`, userData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    if (!response.data) {
      throw new Error("Error registering user");
    }
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}

// 2. Get Profiles - Allows admins to fetch all profiles for moderation
async function getProfiles(userId: string): Promise<any> {
  const userRole = await getUserRole();
  if (userRole !== "admin") {
    throw new Error("Only admin can fetch profiles");
  }
  try {
    const response = await axios.get(`${uri}/users/profile`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching profiles: ", error);
    throw error;
  }
}

// 3. Update Profile - Allows users to update their own profile or admins to update any profile
async function updateProfile(profileId: string, userData: any): Promise<any> {
  const userRole = await getUserRole();
  if (userRole !== "admin" && profileId !== userData.id) {
    throw new Error("Only admin or self can update profile");
  }
  try {
    const response = await axios.put(`${uri}/users/${profileId}`, userData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    if (!response.data) {
      throw new Error("Error updating profile");
    }
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
}

// 4. Delete Profile - Allows users to delete their own profile or admins to delete any profile
async function deleteProfile(profileId: string): Promise<any> {
  const userRole = await getUserRole();
  if (userRole !== "admin" && profileId !== localStorage.getItem("userId")) {
    throw new Error("Only admin or self can delete profile");
  }
  try {
    const response = await axios.delete(`${uri}/users/${profileId}`, {
      withCredentials: true,
    });
    if (!response.data) {
      throw new Error("Error deleting profile");
    }
    return response.data;
  } catch (error) {
    console.error("Error deleting profile:", error);
    throw error;
  }
}

export { deleteProfile, getProfiles, profileUser, updateProfile };
