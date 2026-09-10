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

  // Estados do filtro (elevados do componente Filtro)
  const [busca, setBusca] = useState("");
  const [dificuldade, setDificuldade] = useState([]);
  const [status, setStatus] = useState([]);

  const abrirPerfil = () => setDrawerAberto(true);
  const fecharPerfil = () => setDrawerAberto(false);

  const alternarItem = (valor, lista, setLista) => {
    setLista(lista.includes(valor) ? lista.filter((item) => item !== valor) : [...lista, valor]);
  };

  const atividadesFiltradas = useMemo(() => {
    const termo = busca.toLowerCase();
    return TODAS_ATIVIDADES_MOCK.filter((atividade) => {
      const batePesquisa = atividade.titulo.toLowerCase().includes(termo);
      const bateDificuldade =
        dificuldade.length === 0 || dificuldade.includes(atividade.dificuldade);
      const bateStatus = status.length === 0 || status.includes(atividade.status);
      return batePesquisa && bateDificuldade && bateStatus;
    });
  }, [busca, dificuldade, status]);

  return {
    drawerAberto,
    abrirPerfil,
    fecharPerfil,
    busca,
    setBusca,
    dificuldade,
    setDificuldade,
    status,
    setStatus,
    alternarItem,
    atividadesFiltradas,
  };
}
