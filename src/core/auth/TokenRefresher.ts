import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import type { IRefreshTokenDTO } from "./IRefreshTokenDTO";
import type { ITokenDTO } from "./ITokenDTO";

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // No intentar refrescar token en estas rutas
    const publicRoutes = ["/register", "/login", "/auth", "/any/", "/all/"];

    const isPublicRoute = publicRoutes.some((route) =>
      originalRequest.url?.includes(route)
    );

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isPublicRoute
    ) {
      originalRequest._retry = true;
      const refreshToken = sessionStorage.getItem("refreshToken");

      // Si no hay refreshToken, no intentar refrescar
      if (!refreshToken) {
        return Promise.reject(error);
      }

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
        // Limpiar tokens inválidos
        sessionStorage.removeItem("userId");
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);
