import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  buscarUnidadeAdmin,
  criarLicao,
  atualizarLicao,
  excluirLicao,
  criarAtividadeFala,
  atualizarAtividadeFala,
  excluirAtividadeFala,
} from "../../../services/conteudoService";

// tipo: { chave, rota } — define a rota da API e como montar o corpo do pedido
export const TIPOS = {
  video: { rota: "video", id: "idLicaoVideo" },
  alternativa: { rota: "alternativa", id: "idLicaoAlternativa" },
  fala: { rota: "fala", id: "idLicaoFala" },
  atividadeFala: { rota: null, id: "idAtividadeFala" },
};

function corpoVideo(unidadeId, v) {
  return { UnidadeId: unidadeId, Titulo: v.titulo, VideoDescricao: v.videoDescricao ?? "", VideoUrl: v.videoUrl };
}

function corpoAlternativa(unidadeId, v) {
  return {
    UnidadeId: unidadeId,
    VideoUrl: v.videoUrl ?? "",
    Pergunta: v.pergunta,
    A: v.a,
    B: v.b,
    C: v.c,
    D: v.d,
    RespostaCerta: v.respostaCerta,
    ValorGanho: Number(v.valorGanho || 0),
  };
}

function corpoFala(unidadeId, v) {
  return {
    UnidadeId: unidadeId,
    FraseEsperada: v.fraseEsperada,
    NivelDificuldade: Number(v.nivelDificuldade),
    ValorGanho: Number(v.valorGanho || 0),
    AtividadeFalaId: v.atividadeFalaId ? Number(v.atividadeFalaId) : null,
  };
}

export function useTelaUnidadeAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [unidade, setUnidade] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  // formulário genérico: { tipo, item (ou null), grupoId? }
  const [form, setForm] = useState(null);
  const [paraExcluir, setParaExcluir] = useState(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    const res = await buscarUnidadeAdmin(id);
    if (!res.sucesso) setErro(res.mensagem);
    else setUnidade(res.data);
    setCarregando(false);
  }, [id]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const salvar = async (valores) => {
    const { tipo, item } = form;
    let res;
    if (tipo === "atividadeFala") {
      const dados = { Nome: valores.nome, NivelDificuldade: Number(valores.nivelDificuldade), UnidadeId: unidade.idUnidade };
      res = item ? await atualizarAtividadeFala(item.idAtividadeFala, dados) : await criarAtividadeFala(dados);
    } else {
      const corpo =
        tipo === "video" ? corpoVideo(unidade.idUnidade, valores)
        : tipo === "alternativa" ? corpoAlternativa(unidade.idUnidade, valores)
        : corpoFala(unidade.idUnidade, valores);
      res = item
        ? await atualizarLicao(TIPOS[tipo].rota, item[TIPOS[tipo].id], corpo)
        : await criarLicao(TIPOS[tipo].rota, corpo);
    }
    if (res.sucesso) await carregar();
    return res;
  };

  const confirmarExclusao = async () => {
    const { tipo, item } = paraExcluir;
    const res =
      tipo === "atividadeFala"
        ? await excluirAtividadeFala(item.idAtividadeFala)
        : await excluirLicao(TIPOS[tipo].rota, item[TIPOS[tipo].id]);
    setParaExcluir(null);
    if (!res.sucesso) setErro(res.mensagem);
    else await carregar();
  };

  return {
    unidade,
    carregando,
    erro,
    voltar: () => navigate("/atividades-admin"),
    form,
    abrirForm: (tipo, item = null, grupoId = null) => setForm({ tipo, item, grupoId }),
    fecharForm: () => setForm(null),
    salvar,
    paraExcluir,
    pedirExclusao: (tipo, item) => setParaExcluir({ tipo, item }),
    cancelarExclusao: () => setParaExcluir(null),
    confirmarExclusao,
  };
}
