import api from "./api";

export async function listarConquistas() {
  try {
    const response = await api.get("/Conquista");
    return { sucesso: true, data: response.data };
  } catch (error) {
    const mensagem = error.response?.data?.message || "Erro ao buscar conquistas.";
    return { sucesso: false, mensagem };
  }
}

export async function buscarConquistaPorId(id) {
  try {
    const response = await api.get(`/Conquista/${id}`);
    return { sucesso: true, data: response.data };
  } catch (error) {
    const mensagem = error.response?.data?.message || "Erro ao buscar conquista.";
    return { sucesso: false, mensagem };
  }
}

export async function cadastrarConquista(dados) {
  try {
    const response = await api.post("/Conquista", dados);
    return { sucesso: true, data: response.data };
  } catch (error) {
    const mensagem = error.response?.data?.message || "Erro ao cadastrar conquista.";
    return { sucesso: false, mensagem };
  }
}

export async function editarConquista(id, dados) {
  try {
    const response = await api.put(`/Conquista/${id}`, dados);
    return { sucesso: true, data: response.data };
  } catch (error) {
    const mensagem = error.response?.data?.message || "Erro ao editar conquista.";
    return { sucesso: false, mensagem };
  }
}

export async function deletarConquista(id) {
  try {
    const response = await api.delete(`/Conquista/${id}`);
    return { sucesso: true, data: response.data };
  } catch (error) {
    const mensagem = error.response?.data?.message || "Erro ao deletar conquista.";
    return { sucesso: false, mensagem };
  }
}

export async function concederConquista(dados) {
  try {
    const response = await api.post("/Conquista/conceder", dados);
    return { sucesso: true, data: response.data };
  } catch (error) {
    const mensagem = error.response?.data?.message || "Erro ao conceder conquista.";
    return { sucesso: false, mensagem };
  }
}

export async function listarConquistasUsuario(usuarioId) {
  try {
    const response = await api.get(`/Conquista/usuario/${usuarioId}`);
    return { sucesso: true, data: response.data };
  } catch (error) {
    const mensagem = error.response?.data?.message || "Erro ao buscar conquistas do usuário.";
    return { sucesso: false, mensagem };
  }
}
