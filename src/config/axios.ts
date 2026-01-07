import axios from "axios";
import { auth } from "../firebase/config";

/**
 * Determina la URL base de la API
 * - En producción: requiere VITE_API_URL configurada
 * - En desarrollo: usa localhost como fallback
 */
const getApiBaseURL = (): string => {
  const apiUrl = import.meta.env.VITE_API_URL;
  
  // En producción, no usar localhost como fallback
  if (import.meta.env.PROD) {
    if (!apiUrl) {
      console.error(
        "❌ VITE_API_URL no está configurada en producción. " +
        "Por favor, configura la variable de entorno VITE_API_URL con la URL de tu API en producción."
      );
      // Retornar una URL vacía para que falle de manera clara
      return "";
    }
    return apiUrl;
  }
  
  // En desarrollo, usar localhost como fallback
  return apiUrl || "http://localhost:3019/api";
};

const api = axios.create({
  baseURL: getApiBaseURL(),
});

api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const user = auth.currentUser;

    if (user) {
      const newToken = await user.getIdToken();
      localStorage.setItem("token", newToken);
      config.headers.Authorization = `Bearer ${newToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const user = auth.currentUser;
        if (user) {
          const newToken = await user.getIdToken(true);
          localStorage.setItem("token", newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (error) {
        console.error(error);
      }
    }

    return Promise.reject(error);
  }
);

export { api };
