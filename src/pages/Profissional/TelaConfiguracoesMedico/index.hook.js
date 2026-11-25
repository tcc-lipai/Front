import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../services/authService";
import {
  buscarMeuPerfilProfissional,
  atualizarMeuPerfilProfissional,
} from "../../../services/profissionalService";

const FORM_VAZIO = { nome: "", email: "", registro: "", senha: "" };

export function useTelaConfiguracoesMedico() {
  const navigate = useNavigate();
  const [form, setForm] = useState(FORM_VAZIO);
  const [nomeSalvo, setNomeSalvo] = useState(() => localStorage.getItem("nome") || "");
  const [codigo, setCodigo] = useState("");
  const [qtdePacientes, setQtdePacientes] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      const res = await buscarMeuPerfilProfissional();
      if (!ativo) return;
      if (res.sucesso) {
        const p = res.data;
        setForm({ nome: p.nome ?? "", email: p.email ?? "", registro: p.registro ?? "", senha: "" });
        setCodigo(p.codigoAcesso ?? "");
        setQtdePacientes(p.qtdePacientes ?? null);
      } else {
        setMensagem(res.mensagem);
      }
      setCarregando(false);
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, []);

  const alterar = (campo) => (evento) => setForm((atual) => ({ ...atual, [campo]: evento.target.value }));

  const salvar = async (evento) => {
    evento.preventDefault();
    setSalvando(true);
    setMensagem("");

    const res = await atualizarMeuPerfilProfissional({
      nome: form.nome,
      email: form.email,
      registro: form.registro || null,
      senha: form.senha || null,
    });
    setSalvando(false);

    if (res.sucesso) {
      localStorage.setItem("nome", form.nome);
      localStorage.setItem("email", form.email);
      setNomeSalvo(form.nome);
      setForm((atual) => ({ ...atual, senha: "" }));
      setMensagem("Dados atualizados com sucesso.");
    } else {
      setMensagem(res.mensagem);
    }
  };

  const copiarCodigo = async () => {
    try {
      await navigator.clipboard.writeText(codigo);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      setMensagem(`Não consegui copiar. Código: ${codigo}`);
    }
  };

  const sair = () => {
    logout();
    navigate("/login");
  };

  return {
    form,
    alterar,
    salvar,
    nomeSalvo,
    codigo,
    qtdePacientes,
    carregando,
    salvando,
    mensagem,
    copiado,
    copiarCodigo,
    sair,
  };
}
