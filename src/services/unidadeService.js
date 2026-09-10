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
