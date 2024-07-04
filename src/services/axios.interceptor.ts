import axios from "axios";
import store from "../redux/store";

const tokenInterceptor = axios.create();

tokenInterceptor.interceptors.request.use((config) => {
  console.log("Interceptor llamado");
  const token = store.getState().auth.token; // get token from Redux store
  console.log("Token:", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
export default tokenInterceptor;
