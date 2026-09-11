import api from "./api";

function mensagemDeErro(error, padrao) {
  return error.response?.data?.message || padrao;
}

export async function listarCategorias() {
  try {
    const response = await api.get("/Categoria");
    return { sucesso: true, data: response.data };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: mensagemDeErro(error, "Não foi possível carregar as categorias."),
      data: [],
    };
  }
}

export async function listarPalavras(categoriaId) {
  try {
    const response = await api.get("/Dicionario", {
      params: categoriaId ? { categoriaId } : undefined,
    });
    return { sucesso: true, data: response.data };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: mensagemDeErro(error, "Não foi possível carregar o dicionário."),
      data: [],
    };
  }
}
