import api from "./api";

function mensagemDeErro(error, padrao) {
  return error.response?.data?.message || padrao;
}

export async function enviarMensagemContato(mensagem) {
  try {
    const response = await api.post("/Contato", { mensagem });
    return { sucesso: true, data: response.data };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: mensagemDeErro(error, "Não foi possível enviar a sua mensagem."),
    };
  }
}
