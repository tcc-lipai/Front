import { useCallback, useEffect, useState } from "react";
import {
  listarMeusProfissionais,
  vincularProfissional,
  desvincularProfissional,
} from "../../services/usuarioService";

export function useProfissionaisVinculados() {
  const [profissionais, setProfissionais] = useState([]);
  const [maximo, setMaximo] = useState(3);
  const [carregando, setCarregando] = useState(true);
  const [codigo, setCodigo] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState(null); // { tipo: "ok" | "erro", texto }
  const [paraRemover, setParaRemover] = useState(null);
  const [recarga, setRecarga] = useState(0);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      const res = await listarMeusProfissionais();
      if (!ativo) return;
      if (res.sucesso) {
        setProfissionais(res.data.profissionais);
        setMaximo(res.data.maximo);
      } else {
        setMensagem({ tipo: "erro", texto: res.mensagem });
      }
      setCarregando(false);
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, [recarga]);

  const vincular = useCallback(
    async (evento) => {
      evento.preventDefault();
      const limpo = codigo.trim();
      if (!limpo) {
        setMensagem({ tipo: "erro", texto: "Digite o código do profissional." });
        return;
      }
      setEnviando(true);
      setMensagem(null);
      const res = await vincularProfissional(limpo);
      setEnviando(false);

      if (res.sucesso) {
        setMensagem({ tipo: "ok", texto: res.nome ? `Vinculado a ${res.nome}.` : "Profissional vinculado." });
        setCodigo("");
        setRecarga((n) => n + 1);
      } else {
        setMensagem({ tipo: "erro", texto: res.mensagem });
      }
    },
    [codigo]
  );

  const confirmarRemocao = useCallback(async () => {
    if (!paraRemover) return;
    const res = await desvincularProfissional(paraRemover.id);
    const nome = paraRemover.nome;
    setParaRemover(null);
    if (res.sucesso) {
      setMensagem({ tipo: "ok", texto: `${nome} foi desvinculado(a).` });
      setRecarga((n) => n + 1);
    } else {
      setMensagem({ tipo: "erro", texto: res.mensagem });
    }
  }, [paraRemover]);

  return {
    profissionais,
    maximo,
    carregando,
    codigo,
    setCodigo,
    enviando,
    mensagem,
    paraRemover,
    setParaRemover,
    vincular,
    confirmarRemocao,
    cheio: profissionais.length >= maximo,
  };
}
