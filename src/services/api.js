import axios from "axios";
import { clearCache } from "../utils/apiCache";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://localhost:7268/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Qualquer gravação (concluir atividade, comprar, salvar, editar, login...) pode mudar o que
// outras telas mostram: esvazia a cache antes de enviar e de novo quando a resposta volta.
const ehGravacao = (config) => (config?.method ?? "get").toLowerCase() !== "get";

api.interceptors.request.use((config) => {
  if (ehGravacao(config)) clearCache();
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Sessão expirada / inválida: limpa o login e volta para a tela de entrada.
api.interceptors.response.use(
  (response) => {
    if (ehGravacao(response.config)) clearCache();
    return response;
  },
  (error) => {
    if (ehGravacao(error.config)) clearCache();
    // 401 = token inválido/expirado; 404 na própria conta = ela foi apagada (ex.: pelo admin)
    // e o token ainda não expirou. Nos dois casos a sessão não vale mais.
    const id = localStorage.getItem("id");
    const url = error.config?.url ?? "";
    const propriaContaApagada =
      error.response?.status === 404 &&
      id &&
      (url === `/Usuario/${id}` || url === `/Profissional/${id}`);

    if (error.response?.status === 401 || propriaContaApagada) {
      ["token", "role", "id", "nome", "email"].forEach((chave) => localStorage.removeItem(chave));
      clearCache();
      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
