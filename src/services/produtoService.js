import api from "./api";

function mensagemDeErro(error, padrao) {
  return error.response?.data?.message || padrao;
}

export async function listarProdutos() {
  try {
    const response = await api.get("/Produto");
    return { sucesso: true, data: response.data };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: mensagemDeErro(error, "Não foi possível carregar a loja."),
      data: [],
    };
  }
}

export async function comprarProduto(produtoId, quantidade = 1) {
  try {
    const response = await api.post("/Produto/comprar", {
      produtoId,
      quantidade,
    });
    return { sucesso: true, data: response.data };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: mensagemDeErro(error, "Não foi possível concluir a compra."),
    };
  }
}
