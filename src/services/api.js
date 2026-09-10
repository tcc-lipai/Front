import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://localhost:7268/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Sessão expirada / inválida: limpa o login e volta para a tela de entrada.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      ["token", "role", "id", "nome", "email"].forEach((chave) => localStorage.removeItem(chave));
      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
