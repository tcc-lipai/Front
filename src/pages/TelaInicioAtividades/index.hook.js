// src/pages/TelaInicioAtividades/index.hook.js
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

/** @type {import('./index.types').Atividade[]} */
const ATIVIDADES_MOCK = [
  {
    id: 1,
    titulo: 'Primeira Atividade',
    descricao: 'Aprenda os fundamentos da leitura labial com exercícios introdutórios.',
    imagem: null,
    dificuldade: 'iniciante',
    status: 'Disponivel',
    progresso: 0,
  },
  {
    id: 2,
    titulo: 'Vogais e Consoantes',
    descricao: 'Reconhecimento de vogais e consoantes através da leitura labial.',
    imagem: null,
    dificuldade: 'iniciante',
    status: null,
    progresso: 0,
  },
  {
    id: 3,
    titulo: 'Palavras do Cotidiano',
    descricao: 'Pratique com palavras usadas no dia a dia em diferentes contextos.',
    imagem: null,
    dificuldade: 'intermediario',
    status: null,
    progresso: 0,
  },
  {
    id: 4,
    titulo: 'Frases Completas',
    descricao: 'Leitura de frases completas com ritmo e entonação natural.',
    imagem: null,
    dificuldade: 'intermediario',
    status: null,
    progresso: 0,
  },
  {
    id: 5,
    titulo: 'Conversação Avançada',
    descricao: 'Diálogos complexos e situações de comunicação do mundo real.',
    imagem: null,
    dificuldade: 'avancado',
    status: null,
    progresso: 0,
  },
  {
    id: 6,
    titulo: 'Expressões Idiomáticas',
    descricao: 'Reconhecimento de expressões e gírias comuns na fala cotidiana.',
    imagem: null,
    dificuldade: 'avancado',
    status: null,
    progresso: 0,
  },
];

/**
 * Hook da TelaInicioAtividades.
 * Gerencia a lista de atividades com filtro e navegação.
 *
 * @returns hook com atividades filtradas e handlers
 */
export const useTelaInicioAtividades = () => {
  const navigate = useNavigate();

  /** @type {[import('./index.types').FiltroState, Function]} */
  const [filtro, setFiltro] = useState({
    busca: '',
    dificuldade: { iniciante: false, intermediario: false, avancado: false },
    status: { realizado: false, emAndamento: false, concluido: false },
  });

  const atividadesFiltradas = useMemo(() => {
    const dificuldadesSelecionadas = Object.entries(filtro.dificuldade)
      .filter(([, v]) => v)
      .map(([k]) => k);

    const statusSelecionados = Object.entries(filtro.status)
      .filter(([, v]) => v)
      .map(([k]) => k);

    return ATIVIDADES_MOCK.filter((a) => {
      const matchBusca = a.titulo
        .toLowerCase()
        .includes(filtro.busca.toLowerCase());

      const matchDificuldade =
        dificuldadesSelecionadas.length === 0 ||
        dificuldadesSelecionadas.includes(a.dificuldade);

      const matchStatus =
        statusSelecionados.length === 0 ||
        statusSelecionados.includes(a.status);

      return matchBusca && matchDificuldade && matchStatus;
    });
  }, [filtro]);

  /** @param {import('./index.types').FiltroState} novoFiltro */
  const handleFiltroChange = (novoFiltro) => {
    setFiltro(novoFiltro);
  };

  /** @param {number} id */
  const handleIniciar = (id) => {
    navigate(`/atividades-unidades?atividadeId=${id}`);
  };

  return {
    atividadesFiltradas,
    filtro,
    handleFiltroChange,
    handleIniciar,
  };
};
