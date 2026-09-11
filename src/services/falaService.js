import api from "./api";

function mensagemDeErro(error, padrao) {
  return error.response?.data?.message || padrao;
}

const SEM_ACESSO = "Seu nível de dificuldade ainda não libera as atividades de fala.";

/** Dados da lição de fala (contém a frase esperada). */
export async function buscarLicaoFala(licaoId) {
  try {
    const response = await api.get(`/Licao/fala/${licaoId}`);
    return { sucesso: true, data: response.data };
  } catch (error) {
    if (error.response?.status === 403) {
      return { sucesso: false, mensagem: SEM_ACESSO };
    }
    return {
      sucesso: false,
      mensagem: mensagemDeErro(error, "Não foi possível carregar a atividade."),
    };
  }
}

/** Abre (ou reabre) uma tentativa de fala e devolve o idProgresso. */
export async function iniciarFala(licaoId) {
  try {
    const response = await api.post(`/Progresso/fala/${licaoId}/iniciar`);
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

/**
 * Envia o áudio gravado para avaliação (back-end -> IA -> MMS).
 * Retorna { correta, scoreAcustico, feedback, detalhesFonemas, ... }.
 */
export async function concluirFala(idProgresso, audioBlob) {
  try {
    const form = new FormData();
    form.append("arquivo", audioBlob, "gravacao.webm");

    const response = await api.post(`/Progresso/fala/${idProgresso}/concluir`, form, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 120000,
    });
    return { sucesso: true, data: response.data };
  } catch (error) {
    if (error.response?.status === 502) {
      return {
        sucesso: false,
        mensagem: "O serviço de IA está indisponível agora. Tente de novo em instantes.",
      };
    }
    return {
      sucesso: false,
      mensagem: mensagemDeErro(error, "Não foi possível avaliar a sua fala."),
    };
  }
}

/** Dica articulatória do fonema (RAG). */
export async function buscarDicaFonema(fonema) {
  try {
    const response = await api.get("/Ia/dica-fonema", { params: { fonema } });
    return { sucesso: true, data: response.data };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: mensagemDeErro(error, "Sem dica disponível no momento."),
    };
  }
}
