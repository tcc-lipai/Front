// src/pages/TelaInicioAtividadeUnidade/index.hook.js
import { useState, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

/** @type {import('./index.types').Unidade[]} */
const UNIDADES_MOCK = [
  {
    id: 1,
    numero: 1,
    titulo: 'Introdução à Leitura Labial',
    descricao: 'Aprenda os conceitos fundamentais e como observar os movimentos dos lábios.',
    status: 'Disponivel',
    progresso: 0,
    totalLicoes: 5,
    licoesFeitas: 0,
    icone: '👁️',
    tempoEstimado: '20 min',
  },
  {
    id: 2,
    numero: 2,
    titulo: 'Vogais e Sons Básicos',
    descricao: 'Reconhecimento das vogais e dos sons mais frequentes na fala cotidiana.',
    status: 'bloqueado',
    progresso: 0,
    totalLicoes: 6,
    licoesFeitas: 0,
    icone: '🔤',
    tempoEstimado: '25 min',
  },
  {
    id: 3,
    numero: 3,
    titulo: 'Consoantes Labiais',
    descricao: 'Identificação de consoantes formadas principalmente pelos lábios: B, P, M, V, F.',
    status: 'bloqueado',
    progresso: 0,
    totalLicoes: 8,
    licoesFeitas: 0,
    icone: '💬',
    tempoEstimado: '30 min',
  },
  {
    id: 4,
    numero: 4,
    titulo: 'Palavras do Cotidiano',
    descricao: 'Pratique com palavras usadas frequentemente no dia a dia.',
    status: 'bloqueado',
    progresso: 0,
    totalLicoes: 10,
    licoesFeitas: 0,
    icone: '📝',
    tempoEstimado: '35 min',
  },
  {
    id: 5,
    numero: 5,
    titulo: 'Frases Simples',
    descricao: 'Leitura de frases curtas com contexto claro e vocabulário básico.',
    status: 'bloqueado',
    progresso: 0,
    totalLicoes: 8,
    licoesFeitas: 0,
    icone: '📖',
    tempoEstimado: '30 min',
  },
  {
    id: 6,
    numero: 6,
    titulo: 'Diálogos Reais',
    descricao: 'Situações de comunicação do mundo real: compras, saúde, transporte.',
    status: 'bloqueado',
    progresso: 0,
    totalLicoes: 12,
    licoesFeitas: 0,
    icone: '🗣️',
    tempoEstimado: '45 min',
  },
];

/**
 * Hook da TelaInicioAtividadeUnidade.
 * Gerencia a lista de unidades, seleção e navegação.
 */
export const useTelaInicioAtividadeUnidade = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const atividadeId = searchParams.get('atividadeId') ?? '1';

  const [unidades] = useState(UNIDADES_MOCK);
  const [unidadeSelecionada, setUnidadeSelecionada] = useState(null);

  const proximaUnidade = useMemo(
    () => unidades.find((u) => u.status === 'emAndamento' || u.status === 'disponivel') ?? null,
    [unidades],
  );

  const totalProgresso = useMemo(() => {
    const totalLicoes = unidades.reduce((s, u) => s + u.totalLicoes, 0);
    const licoesFeitas = unidades.reduce((s, u) => s + u.licoesFeitas, 0);
    return totalLicoes > 0 ? Math.round((licoesFeitas / totalLicoes) * 100) : 0;
  }, [unidades]);

  /** @param {import('./index.types').Unidade} unidade */
  const handleSelecionarUnidade = useCallback((unidade) => {
    if (unidade.status === 'bloqueado') return;
    setUnidadeSelecionada((prev) => (prev?.id === unidade.id ? null : unidade));
  }, []);

  /** @param {import('./index.types').Unidade} unidade */
  const handleIniciarUnidade = useCallback(
    (unidade) => {
      if (unidade.status === 'bloqueado') return;
      navigate(`/atividade/alternativa/${unidade.id}?atividadeId=${atividadeId}`);
    },
    [navigate, atividadeId],
  );

  const handleVoltar = useCallback(() => {
    navigate('/inicio-atividades');
  }, [navigate]);

  return {
    unidades,
    unidadeSelecionada,
    proximaUnidade,
    totalProgresso,
    atividadeId,
    handleSelecionarUnidade,
    handleIniciarUnidade,
    handleVoltar,
  };
};
