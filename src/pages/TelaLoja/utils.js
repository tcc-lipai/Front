// utils.js

export const ITENS_LOJA_MOCK = [
  {
    id: "1",
    title: "Bloqueio de ofensiva",
    description: "Protege sua sequência de dias mesmo se você faltar um dia.",
    price: 500,
    tipo: "gelo", // <-- Identificador simples
    isBlocked: false,
  },
  {
    id: "2",
    title: "Multiplicador de Moedas",
    description: "Dobra as moedas conquistadas nas próximas 3 atividades.",
    price: 500,
    tipo: "moedas",
    isBlocked: false,
  },
  {
    id: "3",
    title: "Baú Misterioso",
    description: "Abra para receber uma recompensa surpresa em moedas.",
    price: 500,
    tipo: "bau",
    isBlocked: false,
  },
  {
    id: "4",
    title: "Bloqueio de ofensiva",
    description: "Protege sua sequência de dias mesmo se você faltar um dia.",
    price: 500,
    tipo: "gelo",
    isBlocked: true, // Este usará o coração cinza automaticamente
  },
  {
    id: "5",
    title: "Baú Misterioso",
    description: "Abra para receber uma recompensa surpresa em moedas.",
    price: 500,
    tipo: "bau",
    isBlocked: false,
  },
  {
    id: "6",
    title: "Bloqueio de ofensiva",
    description: "Protege sua sequência de dias mesmo se você faltar um dia.",
    price: 500,
    tipo: "gelo",
    isBlocked: false,
  },
  {
    id: "7",
    title: "Multiplicador de Moedas",
    description: "Dobra as moedas conquistadas nas próximas 3 atividades.",
    price: 500,
    tipo: "moedas",
    isBlocked: false,
  },
];

export function filtrarItensPorBusca(itens, termo) {
  if (!termo) return itens;
  const termoNormalizado = termo.trim().toLowerCase();
  return itens.filter((item) =>
    item.title.toLowerCase().includes(termoNormalizado)
  );
}