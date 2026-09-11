import api from "./api";

function mensagemDeErro(error, padrao) {
  return error.response?.data?.message || padrao;
}

/** Atividades de topo (ex.: "Leitura Labial"), cada uma com suas unidades. */
export async function listarAtividades() {
  try {
    const response = await api.get("/Atividades");
    return { sucesso: true, data: response.data };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: mensagemDeErro(error, "Não foi possível carregar as atividades."),
      data: [],
    };
  }
}

export async function salvarAtividade(atividadeId) {
  try {
    await api.post("/Atividades/salvar", { atividadeId });
    return { sucesso: true };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: mensagemDeErro(error, "Não foi possível salvar a atividade."),
    };
  }
}

export async function dessalvarAtividade(atividadeId) {
  try {
    await api.delete(`/Atividades/salvar/${atividadeId}`);
    return { sucesso: true };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: mensagemDeErro(error, "Não foi possível remover a atividade salva."),
    };
  }
}

export async function listarAtividadesSalvas() {
  try {
    const response = await api.get("/Atividades/salvas");
    return { sucesso: true, data: response.data };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: mensagemDeErro(error, "Não foi possível carregar as atividades salvas."),
      data: [],
    };
  }
}
