import { useEffect, useMemo, useState } from "react";
import { listarNotificacoes, marcarNotificacaoComoLida } from "../../services/notificacaoService";

const UM_DIA_MS = 24 * 60 * 60 * 1000;

function normalizar(notificacao) {
  return {
    id: notificacao.idNotificacao ?? notificacao.IdNotificacao,
    descricao: notificacao.descricao ?? notificacao.Descricao ?? "",
    lida: notificacao.lida ?? notificacao.Lida ?? false,
    dataCriacao: new Date(notificacao.dataCriacao ?? notificacao.DataCriacao).getTime(),
  };
}

export function useTelaNotificacoes() {
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [notificacoes, setNotificacoes] = useState([]);
  const [carregadoEm, setCarregadoEm] = useState(0);
  const [filtro, setFiltro] = useState("nao-lidas");

  const usuarioId = localStorage.getItem("id");

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      const resultado = await listarNotificacoes(usuarioId);
      if (!ativo) return;

      if (resultado.sucesso) {
        setNotificacoes(resultado.data.map(normalizar));
      } else {
        setErro(resultado.mensagem);
      }
      setCarregadoEm(Date.now());
      setCarregando(false);
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, [usuarioId]);

  const marcarComoLida = async (id) => {
    setNotificacoes((atual) =>
      atual.map((notificacao) =>
        notificacao.id === id ? { ...notificacao, lida: true } : notificacao
      )
    );
    await marcarNotificacaoComoLida(id, true);
  };

  const { hoje, ultimoMes } = useMemo(() => {
    const isLida = filtro === "lidas";
    const filtradas = notificacoes.filter((notificacao) => notificacao.lida === isLida);

    return {
      hoje: filtradas.filter((n) => carregadoEm - n.dataCriacao < UM_DIA_MS),
      ultimoMes: filtradas.filter((n) => carregadoEm - n.dataCriacao >= UM_DIA_MS),
    };
  }, [notificacoes, filtro, carregadoEm]);

  return {
    carregando,
    erro,
    filtro,
    setFiltro,
    hoje,
    ultimoMes,
    marcarComoLida,
  };
}
