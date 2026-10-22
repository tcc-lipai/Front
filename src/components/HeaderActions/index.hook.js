import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buscarUsuario } from "../../services/usuarioService";
import { listarNotificacoes } from "../../services/notificacaoService";

export const useHeaderActions = () => {
  const [saldo, setSaldo] = useState(0);
  const [temNaoLida, setTemNaoLida] = useState(false);
  const navigate = useNavigate();
  const usuarioId = localStorage.getItem("id");
  // moedas e notificações são do aluno; profissional/admin não têm (e a API devolveria 403)
  const ehAluno = localStorage.getItem("role") === "Usuario";

  useEffect(() => {
    if (!ehAluno) return;
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
  }, [usuarioId, ehAluno]);

  const handleNotificationClick = () => {
    navigate("/notificacoes");
  };

  return {
    ehAluno,
    xp: saldo,
    hasNotification: temNaoLida,
    handleNotificationClick,
  };
};
