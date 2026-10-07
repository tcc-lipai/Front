import api from "./api";

function mensagemDeErro(error, padrao) {
  const dados = error.response?.data;
  if (dados?.message) return dados.message;
  // erro de validação automática do ASP.NET Core (400 com { errors: { Campo: ["..."] } })
  if (dados?.errors) {
    const mensagens = Object.values(dados.errors).flat();
    if (mensagens.length > 0) return mensagens.join(" ");
  }
  return padrao;
}

// Precisa bater com o enum NivelDificuldade do back-end.
export const NIVEIS_DIFICULDADE = [
  { valor: 1, label: "Iniciante" },
  { valor: 2, label: "Básico" },
  { valor: 3, label: "Intermediário" },
  { valor: 4, label: "Avançado" },
];

const NOME_PARA_VALOR_NIVEL = {
  iniciante: 1,
  basico: 2,
  intermediario: 3,
  avancado: 4,
};

// aceita o nível como número (1-4) ou como nome/rótulo ("Básico", "Basico", "Intermediario")
export function valorNivelDificuldade(valor) {
  if (valor == null || valor === "") return null;
  const numero = Number(valor);
  if (!Number.isNaN(numero)) return numero;
  const chave = String(valor).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  return NOME_PARA_VALOR_NIVEL[chave] ?? null;
}

export function nomeNivelDificuldade(valor) {
  const numero = valorNivelDificuldade(valor);
  return NIVEIS_DIFICULDADE.find((n) => n.valor === numero)?.label ?? "";
}

export async function listarUsuarios() {
  try {
    const response = await api.get("/Usuario");
    return { sucesso: true, data: response.data };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: mensagemDeErro(error, "Não foi possível carregar os pacientes."),
      data: [],
    };
  }
}

export async function excluirUsuario(usuarioId) {
  try {
    await api.delete(`/Usuario/${usuarioId}`);
    return { sucesso: true };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: mensagemDeErro(error, "Não foi possível excluir o paciente."),
    };
  }
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
