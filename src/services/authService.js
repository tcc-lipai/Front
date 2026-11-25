import { clearCache } from "../utils/apiCache";
import api from "./api";

export async function login(email, senha) {
  try {
    const response = await api.post("/Auth/login", { Email: email, Senha: senha });
    const { token, role, id, nome, email: userEmail } = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("id", id);
    localStorage.setItem("nome", nome);
    localStorage.setItem("email", userEmail);

    return { sucesso: true, data: response.data };
  } catch (error) {
    const mensagem =
      error.response?.status === 429
        ? "Muitas tentativas de login. Aguarde 1 minuto e tente de novo."
        : error.response?.data?.message || "Erro ao fazer login.";
    return { sucesso: false, mensagem };
  }
}

export function logout() {
  clearCache();
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("id");
  localStorage.removeItem("nome");
  localStorage.removeItem("email");
}
