import axios from "axios";
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

/** Grupo de fala (nome + ids dos exercícios, em ordem), sem carregar as unidades. */
export async function buscarAtividadeFala(atividadeFalaId) {
  try {
    const response = await api.get(`/AtividadeFala/${atividadeFalaId}`);
    const d = response.data;
    return {
      sucesso: true,
      data: {
        nome: d.nome ?? d.Nome ?? "Atividade de fala",
        idsExercicios: d.exercicios ?? d.Exercicios ?? [],
      },
    };
  } catch (error) {
    if (error.response?.status === 403) {
      return { sucesso: false, mensagem: SEM_ACESSO };
    }
    if (error.response?.status === 404) {
      return { sucesso: false, mensagem: "Atividade não encontrada." };
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
 * `signal` (AbortController) permite abortar a chamada se o aluno sair da tela:
 * o back-end percebe a desconexão e para de esperar a IA. Nesse caso o retorno
 * é { sucesso: false, cancelado: true }.
 */
export async function concluirFala(idProgresso, audioBlob, signal) {
  try {
    const form = new FormData();
    form.append("arquivo", audioBlob, "gravacao.webm");

    const response = await api.post(`/Progresso/fala/${idProgresso}/concluir`, form, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 120000,
      signal,
    });
    return { sucesso: true, data: response.data };
  } catch (error) {
    if (axios.isCancel(error)) {
      return { sucesso: false, cancelado: true };
    }
    if (error.response?.status === 504) {
      return { sucesso: false, mensagem: "A avaliação demorou demais. Tente gravar de novo." };
    }
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
