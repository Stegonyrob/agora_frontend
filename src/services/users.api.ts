import axios from "axios";

// Index:

// 1. Register User - registerUser()
// 2. Get Users - getUsers()
// 3. Update User - updateUser()
// 4. Delete User - deleteUser()

// Environment Variables for API Endpoints
const uri = import.meta.env.VITE_API_ENDPOINT_GENERAL;

// 1. Register User - Allows all users to register
async function registerUser(userData: any): Promise<any> {
  try {
    const response = await axios.post(`${uri}/users/register`, userData, {
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

// 2. Get Users - Allows admins to fetch all users for moderation purposes
async function getUsers(): Promise<any> {
  const userRole = await getUserRole();
  if (userRole !== "admin") {
    throw new Error("Only admin can fetch users");
  }
  try {
    const response = await axios.get(`${uri}/users`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users: ", error);
    throw error;
  }
}

// 3. Update User - Allows users to update their own profile or admins to update any user
async function updateUser(userId: string, userData: any): Promise<any> {
  const userRole = await getUserRole();
  if (userRole !== "admin" && userId !== userData.id) {
    throw new Error("Only admin or self can update user");
  }
  try {
    const response = await axios.put(`${uri}/users/${userId}`, userData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    if (!response.data) {
      throw new Error("Error updating user");
    }
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

// 4. Delete User - Allows users to delete themselves or admins to delete any user
async function deleteUser(userId: string, userData: any): Promise<void> {
  const userRole = await getUserRole();
  if (userRole !== "admin" && userId !== userData.id) {
    throw new Error("Onlyadmin or self can delete user");
  }
  try {
    await axios.delete(`${uri}/users/${userId}`, {
      withCredentials: true,
    });
    await axios.delete(`${uri}/users/profile/${userId}`, {
      withCredentials: true,
    });
    console.log("User deleted successfully.");
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

async function getUserRole(): Promise<string> {
  // Implement a function to get the user's role from the token or database
  // For example:
  const token = localStorage.getItem("authToken");
  const response = await axios.get(`${uri}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.role;
}

export { deleteUser, getUserRole, getUsers, registerUser, updateUser };
