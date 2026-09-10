import { useState, useMemo } from "react";

// Mock de dados para o dicionário
const MOCK_DICIONARIO = [
  { id: "1", categoria: "Comida", titulo: "Laranja", descricao: "Uma fruta cítrica deliciosa." },
  {
    id: "2",
    categoria: "Comida",
    titulo: "Maçã",
    descricao: "Fruta vermelha ou verde, muito crocante.",
  },
  {
    id: "3",
    categoria: "Escola",
    titulo: "Lápis",
    descricao: "Instrumento usado para escrever ou desenhar.",
  },
  {
    id: "4",
    categoria: "Escola",
    titulo: "Caderno",
    descricao: "Conjunto de folhas para anotações.",
  },
  {
    id: "5",
    categoria: "Trabalho",
    titulo: "Computador",
    descricao: "Máquina utilizada para processar dados.",
  },
  {
    id: "6",
    categoria: "Natureza",
    titulo: "Árvore",
    descricao: "Planta de grande porte com tronco de madeira.",
  },
  {
    id: "7",
    categoria: "Saudações",
    titulo: "Olá",
    descricao: "Cumprimento amigável do dia a dia.",
  },
  {
    id: "8",
    categoria: "Saudações",
    titulo: "Bom dia",
    descricao: "Saudação usada no período da manhã.",
  },
];

export function useTelaDicionario() {
  const [categoriaAtiva, setCategoriaAtiva] = useState("Comida");
  const [drawerAberto, setDrawerAberto] = useState(false);

  const abrirPerfil = () => setDrawerAberto(true);
  const fecharPerfil = () => setDrawerAberto(false);

  // Filtra os cards sempre que a categoria ativa mudar
  const cardsFiltrados = useMemo(() => {
    return MOCK_DICIONARIO.filter((card) => card.categoria === categoriaAtiva);
  }, [categoriaAtiva]);

  return {
    categoriaAtiva,
    setCategoriaAtiva,
    cardsFiltrados,
    drawerAberto,
    abrirPerfil,
    fecharPerfil,
  };
}
