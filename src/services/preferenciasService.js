const CHAVE_BASE = "lipai-preferencias";

function obterChave(usuarioId = localStorage.getItem("id")) {
  return `${CHAVE_BASE}:${usuarioId || "anonimo"}`;
}

export function lerPreferencias(usuarioId) {
  try {
    const armazenado = localStorage.getItem(obterChave(usuarioId));

    return armazenado
      ? JSON.parse(armazenado)
      : {
          modoEscuro: false,
          notificacoes: true,
          autenticacao: false,
          historico: true,
        };
  } catch {
    return {
      modoEscuro: false,
      notificacoes: true,
      autenticacao: false,
      historico: true,
    };
  }
}

export function salvarPreferencias(preferencias, usuarioId) {
  localStorage.setItem(obterChave(usuarioId), JSON.stringify(preferencias));
}
