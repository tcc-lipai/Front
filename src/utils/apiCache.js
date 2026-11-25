const DEFAULT_TTL_MS = 60_000;
const cache = new Map();

/** true se o resultado (ou algum dos resultados agrupados) é uma resposta de erro. */
function temErro(valor, profundidade = 0) {
  if (!valor || typeof valor !== "object") return false;
  if (valor.sucesso === false || valor.erro) return true;
  if (profundidade > 0) return false;
  return Object.values(valor).some((item) => temErro(item, profundidade + 1));
}

/** Valor em cache pra essa chave, ou undefined se não existe/expirou. */
export function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return undefined;
  }
  return entry.value;
}

/**
 * Guarda um valor em cache por `ttlMs` (padrão 60s). Não guarda respostas de erro, e regravar
 * o mesmo valor que veio da cache não renova o prazo (senão o dado nunca venceria).
 */
export function setCached(key, value, ttlMs = DEFAULT_TTL_MS) {
  if (temErro(value)) return;
  if (cache.get(key)?.value === value) return;
  cache.set(key, { value, expiresAt: Date.now() + ttlMs });
}

/** Remove uma chave da cache — usar antes de navegar pra uma tela que vai mudar o dado cacheado. */
export function invalidateCached(key) {
  cache.delete(key);
}

/** Esvazia tudo — chamado quando qualquer coisa é gravada no servidor e no logout. */
export function clearCache() {
  cache.clear();
}
