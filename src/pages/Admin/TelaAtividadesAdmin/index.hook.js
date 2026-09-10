import { useMemo, useState } from "react";

const MOCK_ATIVIDADES = [
  {
    id: 1,
    titulo: "Introdução à Leitura Labial",
    descricao: "Teste os seus conhecimentos de leitura labial através de uma ferramenta de IA.",
    dificuldade: "Iniciante",
    tipo: "Escrita",
    progresso: 65,
  },
  {
    id: 2,
    titulo: "Frases do Dia a Dia",
    descricao: "Pratique a leitura labial com frases do quotidiano usando IA.",
    dificuldade: "Iniciante",
    tipo: "Escrita",
    progresso: 80,
  },
  {
    id: 3,
    titulo: "Vocabulário do Contexto Escolar",
    descricao: "Aprenda termos comuns utilizados no ambiente académico.",
    dificuldade: "Iniciante",
    tipo: "Escrita",
    progresso: 45,
  },
  {
    id: 4,
    titulo: "Prática de Áudio Intermediária",
    descricao: "Identifique expressões complexas através do som e labiografia.",
    dificuldade: "Intermediário",
    tipo: "Áudio",
    progresso: 30,
  },
  {
    id: 5,
    titulo: "Desafio Avançado de Leitura",
    descricao: "Desafie-se com palavras mais complexas de leitura labial.",
    dificuldade: "Avançado",
    tipo: "Leitura",
    progresso: 10,
  },
];

const QUANTIDADE_INICIAL = 3;

export function useTelaAtividadesAdmin() {
  const [atividades, setAtividades] = useState(MOCK_ATIVIDADES);
  const [termoBusca, setTermoBusca] = useState("");
  const [mostrarTodas, setMostrarTodas] = useState(false);
  const [drawerAberto, setDrawerAberto] = useState(false);

  const abrirPerfil = () => setDrawerAberto(true);
  const fecharPerfil = () => setDrawerAberto(false);

  const atividadesFiltradas = useMemo(() => {
    const termo = termoBusca.trim().toLowerCase();
    if (!termo) return atividades;
    return atividades.filter((atividade) => atividade.titulo.toLowerCase().includes(termo));
  }, [atividades, termoBusca]);

  const atividadesVisiveis = mostrarTodas
    ? atividadesFiltradas
    : atividadesFiltradas.slice(0, QUANTIDADE_INICIAL);

  const podeVerMais = !mostrarTodas && atividadesFiltradas.length > QUANTIDADE_INICIAL;

  const handleBuscar = (event) => {
    setTermoBusca(event.target.value);
    setMostrarTodas(false);
  };

  const handleVerMais = () => {
    setMostrarTodas(true);
  };

  const handleEditar = (id) => {
    console.log("Editar atividade:", id);
  };

  const handleExcluir = (id) => {
    setAtividades((atual) => atual.filter((atividade) => atividade.id !== id));
  };

  return {
    termoBusca,
    atividadesVisiveis,
    podeVerMais,
    drawerAberto,
    abrirPerfil,
    fecharPerfil,
    handleBuscar,
    handleVerMais,
    handleEditar,
    handleExcluir,
  };
}
