import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buscarUsuario } from "../../services/usuarioService";
import { listarNotificacoes } from "../../services/notificacaoService";

export const useHeaderActions = () => {
  const [saldo, setSaldo] = useState(0);
  const [temNaoLida, setTemNaoLida] = useState(false);
  const navigate = useNavigate();
  const usuarioId = localStorage.getItem("id");

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      const [usuarioRes, notificacoesRes] = await Promise.all([
        buscarUsuario(usuarioId),
        listarNotificacoes(usuarioId),
      ]);
      if (!ativo) return;

      if (usuarioRes.sucesso) {
        setSaldo(usuarioRes.data.saldoAtual ?? usuarioRes.data.SaldoAtual ?? 0);
      }
      if (notificacoesRes.sucesso) {
        setTemNaoLida(
          notificacoesRes.data.some((notificacao) => !(notificacao.lida ?? notificacao.Lida))
        );
      }
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, [usuarioId]);

  const handleNotificationClick = () => {
    navigate("/notificacoes");
  };

  return {
    xp: saldo,
    hasNotification: temNaoLida,
    handleNotificationClick,
  };
};
