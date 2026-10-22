import api from "./api";

function mensagemDeErro(error, padrao) {
  if (error.response?.status === 403) return "Você não tem acesso a este paciente.";
  if (error.response?.status === 404) return "Paciente ou unidade não encontrados.";
  return error.response?.data?.message || padrao;
}

/** Progresso de um paciente em cada unidade (área do profissional). */
export async function buscarProgressoUnidadesDoPaciente(usuarioId) {
  try {
    const response = await api.get(`/Acompanhamento/paciente/${usuarioId}/unidades`);
    return { sucesso: true, data: response.data };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: mensagemDeErro(error, "Não foi possível carregar o progresso do paciente."),
    };
  }
}

/** Detalhe de uma unidade do paciente: por tipo de atividade e por grupo de fala. */
export async function buscarProgressoUnidadeDoPaciente(usuarioId, unidadeId) {
  try {
    const response = await api.get(`/Acompanhamento/paciente/${usuarioId}/unidades/${unidadeId}`);
    return { sucesso: true, data: response.data };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: mensagemDeErro(error, "Não foi possível carregar a unidade do paciente."),
    };
  }
}
