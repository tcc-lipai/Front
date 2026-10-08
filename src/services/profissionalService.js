import api from "./api";

function mensagemDeErro(error, padrao) {
  const dados = error.response?.data;
  if (dados?.message) return dados.message;
  if (dados?.errors) {
    const mensagens = Object.values(dados.errors).flat();
    if (mensagens.length > 0) return mensagens.join(" ");
  }
  return padrao;
}

export async function listarProfissionais() {
  try {
    const response = await api.get("/Profissional");
    return { sucesso: true, data: response.data };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: mensagemDeErro(error, "Não foi possível carregar os profissionais."),
      data: [],
    };
  }
}

export async function buscarProfissional(id) {
  try {
    const response = await api.get(`/Profissional/${id}`);
    return { sucesso: true, data: response.data };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: mensagemDeErro(error, "Não foi possível carregar o profissional."),
    };
  }
}

export async function cadastrarProfissional(dados) {
  try {
    const response = await api.post("/Profissional", dados);
    return { sucesso: true, data: response.data };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: mensagemDeErro(error, "Não foi possível cadastrar o profissional."),
    };
  }
}

export async function atualizarProfissional(id, dados) {
  try {
    await api.put(`/Profissional/${id}`, dados);
    return { sucesso: true };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: mensagemDeErro(error, "Não foi possível atualizar o profissional."),
    };
  }
}

export async function excluirProfissional(id) {
  try {
    await api.delete(`/Profissional/${id}`);
    return { sucesso: true };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: mensagemDeErro(error, "Não foi possível excluir o profissional."),
    };
  }
}

export async function listarPacientesDoProfissional() {
  try {
    const response = await api.get("/Profissional/pacientes");
    return { sucesso: true, data: response.data };
  } catch (error) {
    return {
      sucesso: false,
      mensagem: mensagemDeErro(error, "Não foi possível carregar os pacientes."),
      data: [],
    };
  }
}
