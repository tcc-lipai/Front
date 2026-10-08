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

/** Salva um item específico (fala, fala-sessao, alternativa ou vídeo). */
export async function salvarItem(tipoItem, itemId) {
  try {
    await api.post("/Atividades/item/salvar", { tipoItem, itemId });
    return { sucesso: true };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: mensagemDeErro(error, "Não foi possível salvar o item."),
    };
  }
}

export async function dessalvarItem(tipoItem, itemId) {
  try {
    await api.delete(`/Atividades/item/salvar/${tipoItem}/${itemId}`);
    return { sucesso: true };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: mensagemDeErro(error, "Não foi possível remover o item salvo."),
    };
  }
}

export async function listarItensSalvos() {
  try {
    const response = await api.get("/Atividades/item/salvos");
    return { sucesso: true, data: response.data };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: mensagemDeErro(error, "Não foi possível carregar os itens salvos."),
      data: [],
    };
  }
}
