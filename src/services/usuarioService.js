import api from "./api";

function mensagemDeErro(error, padrao) {
  return error.response?.data?.message || padrao;
}

export async function cadastrarUsuario(dados) {
  try {
    const response = await api.post("/Usuario", dados);
    return { sucesso: true, data: response.data };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: mensagemDeErro(error, "Erro ao cadastrar usuário."),
    };
  }
}

export async function buscarUsuario(usuarioId) {
  if (!usuarioId) {
    return { sucesso: false, mensagem: "Usuário não identificado." };
  }

  try {
    const response = await api.get(`/Usuario/${usuarioId}`);
    return { sucesso: true, data: response.data };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: mensagemDeErro(error, "Não foi possível carregar o perfil."),
    };
  }
}

export async function atualizarUsuario(usuarioId, dados) {
  if (!usuarioId) {
    return { sucesso: false, mensagem: "Usuário não identificado." };
  }

  try {
    const response = await api.put(`/Usuario/${usuarioId}`, dados);
    return { sucesso: true, data: response.data };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: mensagemDeErro(error, "Não foi possível atualizar o perfil."),
    };
  }
}

export async function buscarProgresso(usuarioId) {
  if (!usuarioId) {
    return {
      sucesso: false,
      mensagem: "Usuário não identificado.",
      data: null,
    };
  }

  try {
    const response = await api.get(`/Progresso/usuario/${usuarioId}`);
    return { sucesso: true, data: response.data };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: mensagemDeErro(error, "Não foi possível carregar o progresso."),
      data: null,
    };
  }
}

export function contarAtividadesConcluidas(progresso) {
  const alternativas = progresso?.Alternativas ?? progresso?.alternativas ?? [];
  const falas = progresso?.Falas ?? progresso?.falas ?? [];
  const videos = progresso?.Videos ?? progresso?.videos ?? [];
  const concluidas = [...alternativas, ...falas, ...videos].filter((item) => {
    const status = String(item.Status ?? item.status ?? "").toLowerCase();
    return status === "concluido" || status === "concluida" || status === "completed";
  });

  const licoesUnicas = new Set(
    concluidas.map((item) => {
      const tipo = item.Tipo ?? item.tipo ?? "";
      const licaoId =
        item.LicaoAlternativaId ??
        item.licaoAlternativaId ??
        item.LicaoFalaId ??
        item.licaoFalaId ??
        item.LicaoVideoId ??
        item.licaoVideoId ??
        item.IdProgresso ??
        item.idProgresso;
      return `${tipo}:${licaoId}`;
    })
  );

  return licoesUnicas.size;
}

export function calcularPercentualAtividades(concluidas, total) {
  if (!Number.isFinite(total) || total <= 0) return 0;
  return Math.min(100, Math.round((concluidas / total) * 100));
}
