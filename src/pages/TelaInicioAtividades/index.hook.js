import { useState, useMemo } from "react";
const TODAS_ATIVIDADES_MOCK = [
  {
    id: 1,
    titulo: "Primeira Atividade",
    descricao: "Teste seus conhecimentos de leitura labial...",
    dificuldade: "Iniciante",
    status: "Em andamento",
    tipo: "Escrita",
    progresso: 65,
    categoria: "continuar",
  },
  {
    id: 2,
    titulo: "Segunda Atividade",
    descricao: "Aperfeiçoe suas habilidades com esta atividade...",
    dificuldade: "Intermediário",
    status: "Realizada",
    tipo: "Áudio",
    progresso: 100,
    categoria: "recomendada",
  },
  {
    id: 3,
    titulo: "Terceira Atividade",
    descricao: "Desafio final de leitura labial avançada...",
    dificuldade: "Avançado",
    status: "Concluído",
    tipo: "Leitura",
    progresso: 0,
    categoria: "recomendada",
  },
];

export function useTelaInicioAtividades() {
  const [drawerAberto, setDrawerAberto] = useState(false);

  // Estados que foram "elevados" do componente Filtro
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState([]);
  const [status, setStatus] = useState([]);

  const abrirPerfil = () => setDrawerAberto(true);
  const fecharPerfil = () => setDrawerAberto(false);

  const toggleItem = (value, state, setState) => {
    if (state.includes(value)) {
      setState(state.filter((item) => item !== value));
      return;
    }
    setState([...state, value]);
  };

  // Filtra as atividades com base nos estados atuais
  const atividadesFiltradas = useMemo(() => {
    return TODAS_ATIVIDADES_MOCK.filter((atividade) => {
      const batePesquisa = atividade.titulo.toLowerCase().includes(search.toLowerCase());

      const bateDificuldade = difficulty.length === 0 || difficulty.includes(atividade.dificuldade);

      const bateStatus = status.length === 0 || status.includes(atividade.status);

      return batePesquisa && bateDificuldade && bateStatus;
    });
  }, [search, difficulty, status]);

  return {
    drawerAberto,
    abrirPerfil,
    fecharPerfil,
    search,
    setSearch,
    difficulty,
    setDifficulty,
    status,
    setStatus,
    toggleItem,
    atividadesFiltradas,
  };
}
