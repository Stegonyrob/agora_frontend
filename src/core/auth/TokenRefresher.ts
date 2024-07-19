import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import type { IRefreshTokenDTO } from "./IRefreshTokenDTO";
import type { ITokenDTO } from "./ITokenDTO";

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Check if the error is unauthorized
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Create refresh token DTO
      let refreshToken: string = sessionStorage.getItem("refreshToken")!;
      let refreshTokenDTO: IRefreshTokenDTO = {
        refreshToken: "",
      };
      refreshTokenDTO.refreshToken = refreshToken;
      let config: AxiosRequestConfig = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      try {
        const response: AxiosResponse = await axios.post(
          "http://localhost:8080/api/v1/all/token",
          refreshTokenDTO,
          config
        );
        const newToken: ITokenDTO = response.data;
        // Set the new access token in your state
        sessionStorage.setItem("userId", String(response.data.userId));
        sessionStorage.setItem("accessToken", response.data.accessToken);
        sessionStorage.setItem("refreshToken", response.data.refreshToken);
        // Then retry the original request
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${newToken.accessToken}`;
        return axios(originalRequest);
      } catch (err) {
        // Handle error, e.g., logout user
        console.error(err);
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);
