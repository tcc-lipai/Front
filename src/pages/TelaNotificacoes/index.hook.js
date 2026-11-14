import { useEffect, useMemo, useState } from "react";
import { listarNotificacoes, marcarNotificacaoComoLida } from "../../services/notificacaoService";
import { getCached, setCached } from "../../utils/apiCache";

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
      const chaveCache = `notificacoes:${usuarioId}`;
      const resultado = getCached(chaveCache) ?? (await listarNotificacoes(usuarioId));
      if (!ativo) return;
      setCached(chaveCache, resultado);

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
    // marca também na cache (mesmo formato cru da API), senão um remonte
    // dentro do TTL mostraria a notificação como não lida de novo
    const chaveCache = `notificacoes:${usuarioId}`;
    const emCache = getCached(chaveCache);
    if (emCache?.sucesso) {
      const atualizadas = emCache.data.map((n) =>
        (n.idNotificacao ?? n.IdNotificacao) === id ? { ...n, lida: true, Lida: true } : n
      );
      setCached(chaveCache, { ...emCache, data: atualizadas });
    }
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
