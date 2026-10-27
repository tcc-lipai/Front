// "normal" não grava atributo nenhum no <html> (zoom 100% é o padrão do navegador)
export const NIVEIS_FONTE = ["normal", "grande", "maior", "maximo"];

// Toggles liga/desliga simples: cada chave vira data-<chave-em-kebab-case>="true"
// no <html> quando ativa (removido quando desativa), via dataset — o CSS que
// reage a cada uma fica em src/index.css. A ordem aqui é a ordem no painel.
export const TOGGLES_ACESSIBILIDADE = [
  { chave: "daltonismo", label: "Modo daltônico (corrige certo/errado)" },
  { chave: "leituraVoz", label: "Ler texto em voz alta ao clicar" },
  { chave: "reduzirAnimacao", label: "Reduzir animações" },
  { chave: "destacarLinks", label: "Destacar links e botões" },
  { chave: "espacamento", label: "Aumentar espaçamento do texto" },
  { chave: "fonteLeitura", label: "Fonte de leitura facilitada" },
  { chave: "escalaCinza", label: "Escala de cinza" },
  { chave: "cursorGrande", label: "Cursor grande" },
];
