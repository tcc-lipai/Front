// InfoAtividades.utils.js
// Funções utilitárias do componente InfoAtividade.
// Mantidas separadas do JSX para facilitar testes e reaproveitamento
// quando a integração com o back-end for feita.
// (Sem alterações em relação ao arquivo original enviado.)

export const DIFICULDADES = {
  INICIANTE: "Iniciante",
  INTERMEDIARIO: "Intermediário",
  AVANCADO: "Avançado",
};

export const TIPOS_ATIVIDADE = {
  ESCRITA: "Escrita",
  LEITURA: "Leitura",
  AUDIO: "Áudio",
};

export function normalizarDificuldade(dificuldade) {
  if (!dificuldade) return DIFICULDADES.INICIANTE;
  const valor = dificuldade.trim().toLowerCase();

  if (valor.startsWith("inic")) return DIFICULDADES.INICIANTE;
  if (valor.startsWith("inter")) return DIFICULDADES.INTERMEDIARIO;
  if (valor.startsWith("avan")) return DIFICULDADES.AVANCADO;

  return dificuldade;
}

export function clampProgresso(progresso) {
  const numero = Number(progresso);
  if (Number.isNaN(numero)) return 0;
  return Math.min(100, Math.max(0, numero));
}

export function truncarDescricao(texto, limite = 110) {
  if (!texto) return "";
  if (texto.length <= limite) return texto;
  return `${texto.slice(0, limite).trimEnd()}...`;
}