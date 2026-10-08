import api from "./api";

function erro(error, padrao) {
  const dados = error.response?.data;
  if (dados?.message) return dados.message;
  if (dados?.errors) {
    const mensagens = Object.values(dados.errors).flat();
    if (mensagens.length > 0) return mensagens.join(" ");
  }
  return padrao;
}

async function executar(promessa, padrao) {
  try {
    const response = await promessa;
    return { sucesso: true, data: response?.data };
  } catch (error) {
    return { sucesso: false, mensagem: erro(error, padrao) };
  }
}

export function listarUnidadesAdmin() {
  return executar(api.get("/Unidades"), "Não foi possível carregar as unidades.");
}

export function buscarUnidadeAdmin(id) {
  return executar(api.get(`/Unidades/${id}`), "Não foi possível carregar a unidade.");
}

export function listarAtividades() {
  return executar(api.get("/Atividades"), "Não foi possível carregar as atividades.");
}

export function criarUnidade(dados) {
  return executar(api.post("/Unidades", dados), "Não foi possível criar a unidade.");
}

export function atualizarUnidade(id, dados) {
  return executar(api.put(`/Unidades/${id}`, dados), "Não foi possível salvar a unidade.");
}

export function excluirUnidade(id) {
  return executar(api.delete(`/Unidades/${id}`), "Não foi possível excluir a unidade.");
}

// vídeos, alternativas e exercícios de fala usam o mesmo padrão de rota: /Licao/{tipo}
export function criarLicao(tipo, dados) {
  return executar(api.post(`/Licao/${tipo}`, dados), "Não foi possível salvar.");
}

export function atualizarLicao(tipo, id, dados) {
  return executar(api.put(`/Licao/${tipo}/${id}`, dados), "Não foi possível salvar.");
}

export function excluirLicao(tipo, id) {
  return executar(api.delete(`/Licao/${tipo}/${id}`), "Não foi possível excluir.");
}

export function criarAtividadeFala(dados) {
  return executar(api.post("/AtividadeFala", dados), "Não foi possível criar a atividade de fala.");
}

export function atualizarAtividadeFala(id, dados) {
  return executar(api.put(`/AtividadeFala/${id}`, dados), "Não foi possível salvar a atividade de fala.");
}

export function excluirAtividadeFala(id) {
  return executar(api.delete(`/AtividadeFala/${id}`), "Não foi possível excluir a atividade de fala.");
}
