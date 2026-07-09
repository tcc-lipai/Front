// index.hook.js (TelaAtividadesAdmin)
// Toda a lógica da tela fica aqui, seguindo o mesmo padrão usado na Navbar
// (index.jsx "burro" + index.hook.js com o estado/lógica).
//
// Hoje os dados são mockados localmente. Quando a API estiver pronta,
// troque MOCK_ATIVIDADES por uma chamada de API dentro de um useEffect,
// mantendo os handlers (handleEditar, handleExcluir, handleVerMais...)
// com a mesma assinatura para não precisar mexer no index.jsx.

import { useMemo, useState } from "react";

const MOCK_ATIVIDADES = [
  {
    id: 1,
    titulo: "Primeira Atividade",
    descricao:
      "Teste seus conhecimentos de leitura labial através de uma ferramenta de IA.",
    dificuldade: "Iniciante",
    tipo: "Escrita",
    progresso: 65,
  },
  {
    id: 2,
    titulo: "Primeira Atividade",
    descricao:
      "Teste seus conhecimentos de leitura labial através de uma ferramenta de IA.",
    dificuldade: "Iniciante",
    tipo: "Escrita",
    progresso: 65,
  },
  {
    id: 3,
    titulo: "Primeira Atividade",
    descricao:
      "Teste seus conhecimentos de leitura labial através de uma ferramenta de IA.",
    dificuldade: "Iniciante",
    tipo: "Escrita",
    progresso: 65,
  },
  {
    id: 4,
    titulo: "Segunda Atividade",
    descricao:
      "Pratique a leitura labial com frases do dia a dia usando IA.",
    dificuldade: "Intermediário",
    tipo: "Áudio",
    progresso: 30,
  },
  {
    id: 5,
    titulo: "Terceira Atividade",
    descricao:
      "Desafie-se com palavras mais complexas de leitura labial.",
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

  const atividadesFiltradas = useMemo(() => {
    const termo = termoBusca.trim().toLowerCase();
    if (!termo) return atividades;
    return atividades.filter((atividade) =>
      atividade.titulo.toLowerCase().includes(termo)
    );
  }, [atividades, termoBusca]);

  const atividadesVisiveis = mostrarTodas
    ? atividadesFiltradas
    : atividadesFiltradas.slice(0, QUANTIDADE_INICIAL);

  const podeVerMais =
    !mostrarTodas && atividadesFiltradas.length > QUANTIDADE_INICIAL;

  const handleBuscar = (event) => {
    setTermoBusca(event.target.value);
    setMostrarTodas(false);
  };

  const handleVerMais = () => {
    setMostrarTodas(true);
  };

  const handleEditar = (id) => {
    // TODO: integrar com a rota/modal de edição real da atividade.
    console.log("Editar atividade", id);
  };

  const handleExcluir = (id) => {
    // TODO: chamar a API de exclusão. Por enquanto remove só localmente.
    setAtividades((atual) => atual.filter((atividade) => atividade.id !== id));
  };

  return {
    termoBusca,
    atividadesVisiveis,
    podeVerMais,
    handleBuscar,
    handleVerMais,
    handleEditar,
    handleExcluir,
  };
}