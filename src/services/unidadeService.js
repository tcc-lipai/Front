import api from "./api";

function lista(objeto, ...nomes) {
  for (const nome of nomes) {
    if (Array.isArray(objeto?.[nome])) return objeto[nome];
  }
  return [];
}

export async function listarUnidades() {
  try {
    const response = await api.get("/Unidades");
    const data = Array.isArray(response.data) ? response.data : [];
    return { sucesso: true, data };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: error.response?.data?.message || "Não foi possível carregar as unidades.",
      data: [],
    };
  }
}

/**
 * Versão leve de listarUnidades: só nome e contagens por unidade, sem o
 * conteúdo de cada exercício. Use nos lugares que só precisam listar/contar
 * unidades (ex: Dashboard, barra de progresso) — não serve para telas que
 * precisam abrir uma unidade e mostrar os exercícios em si.
 */
export async function listarUnidadesResumo() {
  try {
    const response = await api.get("/Unidades/resumo");
    const data = Array.isArray(response.data) ? response.data : [];
    return { sucesso: true, data };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: error.response?.data?.message || "Não foi possível carregar as unidades.",
      data: [],
    };
  }
}

/** Soma as lições de todas as unidades (fala, alternativa, vídeo e vibração). */
export function contarLicoesDasUnidades(unidades = []) {
  return unidades.reduce(
    (total, unidade) =>
      total +
      lista(unidade, "LicoesFala", "licoesFala").length +
      lista(unidade, "LicoesAlternativa", "licoesAlternativa").length +
      lista(unidade, "LicoesVideo", "licoesVideo").length +
      lista(unidade, "LicoesVibracao", "licoesVibracao").length,
    0
  );
}

/** Mesma soma de contarLicoesDasUnidades, mas a partir de listarUnidadesResumo. */
export function contarLicoesDoResumo(unidadesResumo = []) {
  return unidadesResumo.reduce(
    (total, unidade) => total + (unidade.totalLicoes ?? unidade.TotalLicoes ?? 0),
    0
  );
}
