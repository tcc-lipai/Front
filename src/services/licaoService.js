import api from "./api";

function mensagemDeErro(error, padrao) {
  return error.response?.data?.message || padrao;
}

const SEM_ACESSO = "Seu nível de dificuldade ainda não libera essa atividade.";

async function buscarLicao(tipo, id, padraoErro) {
  try {
    const response = await api.get(`/Licao/${tipo}/${id}`);
    return { sucesso: true, data: response.data };
  } catch (error) {
    if (error.response?.status === 403) {
      return { sucesso: false, mensagem: SEM_ACESSO };
    }
    return { sucesso: false, mensagem: mensagemDeErro(error, padraoErro) };
  }
}

export function buscarLicaoVideo(id) {
  return buscarLicao("video", id, "Não foi possível carregar o vídeo.");
}

export function buscarLicaoAlternativa(id) {
  return buscarLicao("alternativa", id, "Não foi possível carregar a atividade.");
}

export function buscarLicaoVibracao(id) {
  return buscarLicao("vibracao", id, "Não foi possível carregar a atividade.");
}
