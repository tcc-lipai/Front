import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  buscarUsuario,
  cadastrarUsuario,
  atualizarUsuario,
  valorNivelDificuldade,
} from "../../../services/usuarioService";

const FORM_VAZIO = {
  nome: "",
  email: "",
  senha: "",
  nivelDificuldade: "",
  diagnostico: "",
  codigoProfissional: "",
};

export function useTelaPacienteCadastro() {
  const { id } = useParams();
  const navigate = useNavigate();
  const modoEdicao = !!id;

  const [form, setForm] = useState(FORM_VAZIO);
  const [carregando, setCarregando] = useState(modoEdicao);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!modoEdicao) return;
    let ativo = true;

    async function carregar() {
      const res = await buscarUsuario(id);
      if (!ativo) return;
      if (!res.sucesso) {
        setErro(res.mensagem);
        setCarregando(false);
        return;
      }
      const u = res.data;
      setForm({
        nome: u.nome ?? u.Nome ?? "",
        email: u.email ?? u.Email ?? "",
        senha: "",
        nivelDificuldade: String(valorNivelDificuldade(u.nivelDificuldade ?? u.NivelDificuldade) ?? ""),
        diagnostico: u.diagnostico ?? u.Diagnostico ?? "",
        codigoProfissional: "",
      });
      setCarregando(false);
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, [id, modoEdicao]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((atual) => ({ ...atual, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");

    if (!form.nome || !form.email || (!modoEdicao && !form.senha) || !form.nivelDificuldade) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    setEnviando(true);

    const payloadBase = {
      Nome: form.nome,
      Email: form.email,
      NivelDificuldade: Number(form.nivelDificuldade),
      Diagnostico: form.diagnostico || null,
    };

    // no PUT, "" e null têm significados diferentes pro back-end: "" desvincula
    // o profissional atual, null significa "não mexe". No POST tanto faz.
    const resultado = modoEdicao
      ? await atualizarUsuario(id, {
          ...payloadBase,
          Senha: form.senha || null,
          CodigoProfissional: form.codigoProfissional,
        })
      : await cadastrarUsuario({
          ...payloadBase,
          Senha: form.senha,
          CodigoProfissional: form.codigoProfissional || null,
        });

    setEnviando(false);

    if (!resultado.sucesso) {
      setErro(resultado.mensagem);
      return;
    }

    navigate("/dashboard-admin");
  }

  return {
    modoEdicao,
    form,
    carregando,
    enviando,
    erro,
    handleChange,
    handleSubmit,
  };
}
