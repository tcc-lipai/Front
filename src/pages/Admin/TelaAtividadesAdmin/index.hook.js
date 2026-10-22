import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  listarUnidadesAdmin,
  listarAtividades,
  criarUnidade,
  atualizarUnidade,
  excluirUnidade,
} from "../../../services/conteudoService";

export function useTelaAtividadesAdmin() {
  const navigate = useNavigate();

  const [unidades, setUnidades] = useState([]);
  const [atividades, setAtividades] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [formAberto, setFormAberto] = useState(false);
  const [unidadeEditando, setUnidadeEditando] = useState(null);
  const [unidadeParaExcluir, setUnidadeParaExcluir] = useState(null);

  // recarga manual (pós-edição): incrementa o contador e o efeito busca de novo
  const [recarga, setRecarga] = useState(0);
  const carregar = useCallback(() => setRecarga((n) => n + 1), []);

  useEffect(() => {
    let ativo = true;

    (async () => {
      const [resUnidades, resAtividades] = await Promise.all([listarUnidadesAdmin(), listarAtividades()]);
      if (!ativo) return;
      if (!resUnidades.sucesso) setErro(resUnidades.mensagem);
      else {
        setErro("");
        setUnidades(resUnidades.data);
      }
      if (resAtividades.sucesso) setAtividades(resAtividades.data);
      setCarregando(false);
    })();

    return () => {
      ativo = false;
    };
  }, [recarga]);

  const salvarUnidade = async (valores) => {
    const dados = { Nome: valores.nome, AtividadeId: Number(valores.atividadeId) };
    const res = unidadeEditando
      ? await atualizarUnidade(unidadeEditando.idUnidade, dados)
      : await criarUnidade(dados);
    if (res.sucesso) await carregar();
    return res;
  };

  const confirmarExclusao = async () => {
    const res = await excluirUnidade(unidadeParaExcluir.idUnidade);
    setUnidadeParaExcluir(null);
    if (!res.sucesso) setErro(res.mensagem);
    else await carregar();
  };

  return {
    unidades,
    atividades,
    carregando,
    erro,
    formAberto,
    abrirNova: () => {
      setUnidadeEditando(null);
      setFormAberto(true);
    },
    abrirEdicao: (u) => {
      setUnidadeEditando(u);
      setFormAberto(true);
    },
    fecharForm: () => setFormAberto(false),
    unidadeEditando,
    salvarUnidade,
    unidadeParaExcluir,
    setUnidadeParaExcluir,
    confirmarExclusao,
    abrirUnidade: (u) => navigate(`/atividades-admin/${u.idUnidade}`),
  };
}
