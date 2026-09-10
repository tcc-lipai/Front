# LipAI — Front-end

Sistema de leitura labial e treinamento da voz. React + Vite.

## Rodando o projeto

```bash
npm i
npm run dev
```

Antes de subir mudanças, sincronize com a `main`:

```bash
git pull origin main
```

## Scripts

| Comando                | O que faz                                  |
| ---------------------- | ------------------------------------------ |
| `npm run dev`          | servidor de desenvolvimento                |
| `npm run build`        | build de produção em `dist/`               |
| `npm run preview`      | serve o build localmente                   |
| `npm run lint`         | ESLint                                     |
| `npm run format`       | formata tudo com Prettier                  |
| `npm run format:check` | só verifica a formatação (não altera nada) |

## Configuração

Copie `.env.example` para `.env` e ajuste se precisar:

```
VITE_API_BASE_URL=https://localhost:7268/api
```

Sem `.env`, o app usa esse mesmo valor como padrão.

## Organização

```
src/
  components/   componentes reutilizáveis (pasta PascalCase, entrada index.jsx)
  pages/        telas, uma por rota
  services/     acesso à API (axios) — todas as chamadas passam por aqui
  hooks/        hooks globais
  styles/       theme.css (tema escuro central)
  routes/       definição das rotas
```

Convenção por pasta: `index.jsx` + `index.css` + opcionais `index.hook.js`,
`index.types.js`, `index.utils.js`.

### Tema (claro / escuro)

As cores vêm de tokens CSS (`var(--lipai-*)`) definidos em `src/index.css`.
As telas escrevem o tema claro normalmente; o tema escuro é tratado de forma
central em `src/styles/theme.css`. Não use hex de cor fixo para superfície,
texto ou destaque — use os tokens.
