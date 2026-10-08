import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  buscarProfissional,
  cadastrarProfissional,
  atualizarProfissional,
} from "../../../services/profissionalService";

const FORM_VAZIO = { nome: "", email: "", senha: "", registro: "" };

export function useTelaProfissionalCadastro() {
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
      const res = await buscarProfissional(id);
      if (!ativo) return;
      if (!res.sucesso) {
        setErro(res.mensagem);
        setCarregando(false);
        return;
      }
      const p = res.data;
      setForm({
        nome: p.nome ?? p.Nome ?? "",
        email: p.email ?? p.Email ?? "",
        senha: "",
        registro: p.registro ?? p.Registro ?? "",
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

    if (!form.nome || !form.email || (!modoEdicao && !form.senha)) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }

    setEnviando(true);
    const dados = {
      Nome: form.nome,
      Email: form.email,
      Registro: form.registro || null,
    };

    const resultado = modoEdicao
      ? await atualizarProfissional(id, { ...dados, Senha: form.senha || null })
      : await cadastrarProfissional({ ...dados, Senha: form.senha });

    setEnviando(false);

    if (!resultado.sucesso) {
      setErro(resultado.mensagem);
      return;
    }

    navigate("/profissional-admin");
  }

  return { modoEdicao, form, carregando, enviando, erro, handleChange, handleSubmit };
}
