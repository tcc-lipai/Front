import api from "./api";

function mensagemDeErro(error, padrao) {
  return error.response?.data?.message || padrao;
}

const SEM_ACESSO = "Seu nível de dificuldade ainda não libera essa atividade.";

export async function iniciarAlternativa(licaoId) {
  try {
    const response = await api.post(`/Progresso/alternativa/${licaoId}/iniciar`);
    return { sucesso: true, idProgresso: response.data.idProgresso };
  } catch (error) {
    if (error.response?.status === 403) {
      return { sucesso: false, mensagem: SEM_ACESSO };
    }
    return {
      sucesso: false,
      mensagem: mensagemDeErro(error, "Não foi possível iniciar a atividade."),
    };
  }
}

export async function concluirAlternativa(idProgresso, respostaDada) {
  try {
    const response = await api.post(`/Progresso/alternativa/${idProgresso}/concluir`, {
      respostaDada,
    });
    return { sucesso: true, data: response.data };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: mensagemDeErro(error, "Não foi possível registrar a sua resposta."),
    };
  }
}

/** Percentuais de acerto em interpretação (alternativa) e fala. */
export async function buscarDesempenho(usuarioId) {
  if (!usuarioId) return { sucesso: false, mensagem: "Usuário não identificado.", data: null };

  try {
    const response = await api.get(`/Progresso/desempenho/${usuarioId}`);
    return { sucesso: true, data: response.data };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: mensagemDeErro(error, "Não foi possível carregar o desempenho."),
      data: null,
    };
  }
}
