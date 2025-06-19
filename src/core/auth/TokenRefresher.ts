import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import type { IRefreshTokenDTO } from "./IRefreshTokenDTO";
import type { ITokenDTO } from "./ITokenDTO";

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = sessionStorage.getItem("refreshToken")!;
      const refreshTokenDTO: IRefreshTokenDTO = { refreshToken };
      const config: AxiosRequestConfig = {
        headers: { "Content-Type": "application/json" },
      };
      try {
        const response: AxiosResponse = await axios.post(
          import.meta.env.VITE_API_ENDPOINT_REFRESH_TOKEN,
          refreshTokenDTO,
          config
        );
        const newToken: ITokenDTO = response.data;
        sessionStorage.setItem("userId", String(newToken.userId));
        sessionStorage.setItem("accessToken", newToken.accessToken);
        sessionStorage.setItem("refreshToken", newToken.refreshToken);
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${newToken.accessToken}`;
        return axios(originalRequest);
      } catch (err) {
        // Aquí puedes hacer logout o redirigir
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);
