const DEFAULT_TTL_MS = 30_000;
const cache = new Map();

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

/** Guarda um valor em cache por `ttlMs` (padrão 30s). */
export function setCached(key, value, ttlMs = DEFAULT_TTL_MS) {
  cache.set(key, { value, expiresAt: Date.now() + ttlMs });
}

/** Remove uma chave da cache — usar antes de navegar pra uma tela que vai mudar o dado cacheado. */
export function invalidateCached(key) {
  cache.delete(key);
}
