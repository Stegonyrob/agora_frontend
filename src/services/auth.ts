import axios from "axios";
import { setCredentials } from "../redux/authSlice";
import store from "../redux/store";

const uri = import.meta.env.VITE_API_ENDPOINT_LOGIN;
const uri2 = import.meta.env.VITE_API_ENDPOINT_LOGOUT;

interface AuthResponse {
  [x: string]: any;
  accessToken: string;
  refreshToken: string;
  userId: number;
  role: string;
}

const login = async (
  username: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${uri}`, {
      username,
      password,
    });

    const { accessToken, refreshToken, userId } = response.data;

    const { user, role } = response.data;
    store.dispatch(
      setCredentials({
        isAuthenticated: true,
        user,
        role,
        accessToken: "",
        userId: undefined,
        refreshToken: "",
        error: undefined,
        success: false,
        isLoggedIn: true,
        loading: false,
      })
    );

    console.log("Authentication state:", store.getState().auth);

    console.log(accessToken);
    const tokenPayload = JSON.parse(atob(accessToken.split(".")[1]));
    console.log(accessToken);
    const userRole = tokenPayload.role;
    const token = localStorage.getItem("authToken");
    console.log(token);
    console.log(localStorage.getItem(accessToken));
    console.log("Logout token:", token);
    console.log(`El usuario tiene el rol de ${userRole}`);

    return { accessToken, refreshToken, userId, role: userRole };
  } catch (error) {
    throw new Error("Authentication failed");
  }
};
const logout = async (): Promise<void> => {
  try {
    const token = localStorage.getItem("authToken");
    console.log("Logout token:", token);
    if (token) {
      const response = await axios.post(
        `${uri2}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Logout response:", response);
      if (response.status === 200) {
        // Token was successfully invalidated, remove it from local storage
        localStorage.removeItem("authToken");
        console.log("Logged out successfully!");
      } else {
        console.error("Error logging out:", response.status, response.data);
      }
    } else {
      console.log("No token found, already logged out.");
    }
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

export { login, logout };

// import { createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";
// import { setCredentials } from "../../redux/authSlice";
// import store from "../../redux/store";

// interface AuthResponse {
//   [x: string]: any;
//   accessToken: string;
//   refreshToken: string;
//   userId: number;
//   role: string;
// }

// export const userLogin = createAsyncThunk<
//   AuthResponse,
//   { email: string; password: string },
//   { rejectValue: string }
// >("auth/login", async ({ email, password }, { rejectWithValue }) => {
//   try {
//     const uri = `${import.meta.env.VITE_API_ENDPOINT_LOGIN}`;
//     const response = await axios.post<AuthResponse>(uri, { email, password });

//     const { accessToken, refreshToken, userId, user, role } = response.data;

//     store.dispatch(
//       setCredentials({
//         isAuthenticated: true,
//         user,
//         role,
//         accessToken,
//         userId,
//       })
//     );

//     localStorage.setItem("authToken", accessToken);

//     return { accessToken, refreshToken, userId, role };
//   } catch (error: any) {
//     if (error.response && error.response.data.message) {
//       return rejectWithValue(error.response.data.message);
//     } else {
//       return rejectWithValue(error.message);
//     }
//   }
// });

// export const logout = async (): Promise<void> => {
//   try {
//     const uri2 = `${import.meta.env.VITE_API_ENDPOINT_LOGOUT}`;
//     const token = localStorage.getItem("authToken");

//     if (token) {
//       const response = await axios.post(
//         uri2,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.status === 200) {
//         localStorage.removeItem("authToken");
//         console.log("Logged out successfully!");
//       } else {
//         console.error("Error logging out:", response.status, response.data);
//       }
//     } else {
//       console.log("No token found, already logged out.");
//     }
//   } catch (error) {
//     console.error("Error logging out:", error);
//   }
// };
