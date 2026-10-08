import api from "./api";

function mensagemDeErro(error, padrao) {
  return error.response?.data?.message || padrao;
}

export async function listarNotificacoes(usuarioId) {
  if (!usuarioId) return { sucesso: false, mensagem: "Usuário não identificado.", data: [] };

  try {
    const response = await api.get(`/Notificacoes/usuario/${usuarioId}`);
    return { sucesso: true, data: response.data };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: mensagemDeErro(error, "Não foi possível carregar as notificações."),
      data: [],
    };
  }
}

export async function marcarNotificacaoComoLida(id, lida = true) {
  try {
    await api.put(`/Notificacoes/${id}`, { lida });
    return { sucesso: true };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: mensagemDeErro(error, "Não foi possível atualizar a notificação."),
    };
  }
}
