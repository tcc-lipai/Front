# LipAI — contexto do projeto (pra passar pra outra IA)

Documento gerado após várias sessões de trabalho cobrindo padronização do
front-end, integração com IA, conexão completa do front com o back-end,
criação de conteúdo pedagógico real (26 fonemas) e otimizações de
performance. Serve como brief técnico para a próxima IA/pessoa dar
continuidade — leia antes de sugerir próximos passos.

**Atualizado em**: 2026-10-19 (última sessão: expansão de conteúdo de fala
por nível, tela de Configurações do Admin, otimização de carregamento).

## 1. Visão geral — 3 repositórios

| Repo | Caminho local | Stack | Papel |
|---|---|---|---|
| **Front** | `C:\Users\Cintia\Desktop\Front` | React 19 + Vite + React Router 7 + axios + framer-motion + lucide-react | app do aluno/profissional/admin |
| **Backend** | `C:\Users\Cintia\source\repos\Backend\BancodeDados` | .NET 10, ASP.NET Core Web API, EF Core 9 + SQL Server (`LipaiDB` em `localhost\SQLEXPRESS`), JWT | API REST, dono do banco |
| **LipAI_LLM** | `C:\Users\Cintia\Desktop\LipAI_LLM` | Python 3.11, FastAPI, torch/torchaudio/transformers (MMS), LangChain + Chroma (RAG) + Ollama | IA: nota de pronúncia + feedback + lições adaptativas |

GitHub: `tcc-lipai/Front`, `tcc-lipai/Backend`, `tcc-lipai/LipAI_LLM`.
Usuário do git: `arthurgaelll`. Admin do sistema: `leituralabialtcc@gmail.com`
(hash/senha configurados em `appsettings.json`, nunca comitados em texto puro).

**Estado das branches (importante, mudou desde a última versão deste
documento):**

| Repo | Branch | Status |
|---|---|---|
| **Front** | `main` | **tudo mergeado, push direto autorizado pelo dono do projeto** |
| **Backend** | `main` | **tudo mergeado, push direto autorizado pelo dono do projeto** |
| **LipAI_LLM** | `experimento/mms-estilo-colab` | **ainda NÃO mergeada** — ver alerta de segurança abaixo |

A partir desta sessão o fluxo de trabalho mudou: **Front e Backend sobem
direto pra `main`, sem PR intermediário** (pedido explícito do dono do
projeto). Só o LipAI_LLM ainda não seguiu esse fluxo.

⚠️ **Alerta de segurança pendente**: o branch `origin/main` do **LipAI_LLM**
tem uma **chave de API da Groq hardcoded no histórico de commits** (em uma
versão antiga de `app_llm.py`). A branch `experimento/mms-estilo-colab`
(atual, sem a chave) já foi atualizada e não a usa mais, mas o histórico do
`main` remoto ainda a expõe. **Ação pendente: rotacionar a chave Groq no
painel da Groq e, idealmente, reescrever o histórico do `main`** (ou pelo
menos garantir que ninguém mergeie de volta uma versão antiga). Isso nunca
foi feito — fica como prioridade de segurança pra próxima sessão.

## 2. O que foi feito, em ordem cronológica

### Front — padronização (mergeado na `main`, histórico antigo)
Commits (nas mensagens tem o "antes/depois" detalhado):
`8307ed6` ferramental (Prettier/ESLint/.env) + remoção de código morto →
`c621dd0` modo escuro central (era 540 linhas espalhadas em 28 arquivos,
virou 1 arquivo `src/styles/theme.css` + tokens `var(--lipai-*)` em
`src/index.css`, paleta "carvão neutro") →
`196b8bb` convenção única de nomes (`index.hook.js`/`index.types.js`/
`index.utils.js`, pastas PascalCase) →
`a0f69ea` unificou as 3 Navbars (aluno/admin/profissional eram idênticas)
em `<Navbar itens={NAV_ITENS_ALUNO|_ADMIN|_PROFISSIONAL}>` →
`97039f6` unificou as 3 telas de listagem de usuário (admin pacientes,
admin profissionais, profissional pacientes) em `<PainelListaUsuarios>` +
`<DropdownFiltro>` →
`c85f978` telas passam a usar a camada de `services/`, interceptor de 401
no `api.js` →
`a6758f5` `Botao` ganhou variantes temáticas (`primario`/`secundario`/
`perigo`), `Filtro` traduzido pra português →
`6c47088` README.

### Front — integração da atividade de fala + fluxo completo do aluno (mergeado)
- `src/services/falaService.js`, `src/hooks/useGravadorAudio.js` (grava do
  microfone via `MediaRecorder`); `components/Fala` virou controlado
  (ocioso/gravando/enviando/correto/incorreto/erro).
- `TelaAtividadeFala`/`TelaAtividadeFalaSessao` ligadas à lição real,
  gravam, enviam pro back-end, mostram nota + fonemas coloridos + feedback.
- **Bug real corrigido**: cadastro só tinha 3 níveis com valores errados e
  não logava automaticamente depois de criar a conta. Corrigido.
- Dashboard, Dicionário, Loja (botão de comprar sem `onClick`, corrigido),
  Notificações, Atividades salvas, Atividade de Interpretação/Vídeo,
  Contato — todas ligadas à API real.

### Backend — integração com a IA (mergeado)
- Back-end conversa só com `app_llm` (porta 8001), que orquestra MMS + RAG
  + motor adaptativo. `HttpClient` nomeado `"IA"` com timeout de 120s.
- `POST /api/Progresso/fala/{id}/concluir` persiste `ScoreAcustico`,
  `FeedbackIA`, `DetalhesFonemasJson` e atualiza `Usuario.EstadoAdaptativoIA`.
- `GET /api/Progresso/fala/proximo-exercicio` — próximo item pelo motor
  adaptativo.
- `GET /api/Ia/dica-fonema` e `GET /api/Ia/health` — repasse pro `app_llm`.
- Fix real de produção: `MediaRecorder` manda
  `Content-Type: audio/webm;codecs=opus`, e `new MediaTypeHeaderValue(...)`
  não aceita parâmetros → trocado por `MediaTypeHeaderValue.TryParse`.
- `Data/SeedData.cs`: popula o banco em Development (idempotente).

### LipAI_LLM — portão de IA (mergeado na branch de experimento, NÃO na main)
- `app_llm.py` ganhou rotas `/ia/*` **stateless** pro back-end consumir:
  `POST /ia/avaliar-fala`, `GET /ia/proximo-exercicio`,
  `GET /ia/dica-fonema?fonema=X`, `GET /ia/health`.
- Feedback em linguagem natural via Ollama (`qwen2.5:3b`), com fallback
  determinístico por regras se o Ollama estiver indisponível.
- `criar_rag.py` corrigido pra achar `Dica.docx` **e** `Dicas.docx`.

### Admin e Profissional — painéis ligados à API real (mergeado)
Antes só usavam dados mock. Agora:
- **Admin**: gestão real de pacientes (`TelaPacienteCadastro`),
  profissionais (`TelaProfissionaisAdmin`/`TelaProfissionalCadastro`),
  atividades/unidades/lições (`TelaAtividadesAdmin`/`TelaUnidadeAdmin`), e
  rotas bloqueadas por papel (`RotaProtegida`).
- **Profissional**: painel com pacientes reais vinculados
  (`ProfissionalController.GetPacientes` agora retorna `Email` e
  `UltimaAtividadeData` também).

### Sessão atual — conteúdo pedagógico por fonema + nível de acesso + performance

Essa foi a sessão mais substancial depois da integração inicial. Resumo:

**1. Sistema de nível de acesso (já existia no código, só faltava conteúdo
pra valer a pena)** — `Services/RegraNivelService.cs`:
```csharp
PodeAcessarVibracao(nivel) => nivel == Iniciante || nivel == Basico;
PodeAcessarOutrosTipos(nivel) => nivel != Iniciante;
```
Ou seja: usuário **Iniciante** só pode fazer atividades de **Vibração**
(Acompanhante); a partir de **Básico** libera fala/vídeo/alternativa. Isso
é aplicado tanto no back (`LicaoController.VerificarAcesso`,
`ProgressoController`) quanto no front (`TelaInicioAtividadeUnidade`, que
mostra um banner explicando a restrição pro Iniciante).

**2. Conteúdo real criado para as 26 unidades (fonema A → Z)**:
- Fonte: `LipAI_LLM/banco_conteudo.json` (extraído dos `.docx` de
  dicas/palavras por fonema via `extrator_conteudo.py`).
- Cada fonema agora tem: ~8 sílabas de **Vibração** (nível 1, Iniciante) +
  **atividades de Fala separadas por nível de dificuldade** — até 6 grupos
  de 8 exercícios por nível (**Básico**/**Intermediário**/**Avançado**),
  nomeados `"Fala {Letra} - {Nível} {n}"` (ex. `"Fala T - Intermediario 3"`).
  Letras com pouco conteúdo-fonte (M, W, X, Y) ficaram com menos grupos —
  isso é esperado, é limite real dos dados extraídos, não um bug.
- **Total no banco**: 26 unidades, **~2.981 exercícios de fala** + ~190
  sílabas de vibração.
- Mapeamento de nível: `nivel2` → Básico · `nivel3_palavras`+
  `nivel3_frases` → Intermediário · `nivel4`+`vocabulario` → Avançado.
- Criado via scripts PowerShell no diretório de trabalho da sessão (não
  versionados — eram ferramentas pontuais de importação em massa pela API
  Admin, não fazem parte do código do projeto).

**3. `ProgressoVibracao` — subsistema novo, não existia**:
- `Models/ProgressoVibracao.cs` (mesmo formato de `ProgressoVideo`),
  migration `AdicionaProgressoVibracao`, endpoint
  `POST /api/Progresso/vibracao/{licaoId}/concluir`, e `Vibracoes` incluído
  no retorno de `GET /api/Progresso/usuario/{id}`.
- Front: `TelaAcompanhanteIA` deixou de ser 100% estática (fixa em "100%")
  e passou a carregar a lição real e registrar conclusão de verdade.

**4. Dica do fonema antes da primeira atividade** — `DicaFonemaModal`
(novo componente): na primeira vez que o usuário entra numa unidade
(nenhum item dela ainda concluído), mostra a dica articulatória do fonema
(endpoint RAG `/ia/dica-fonema`, que já existia mas estava órfão/não
usado) antes de deixar abrir a atividade.

**5. Admin — CRUD de `AtividadeFala` + filtro por nível**:
- `AtividadeFalaController` novo (POST/PUT/DELETE), `LicaoFala` ganhou
  `AtividadeFalaId` (agrupamento) com `Ordem` auto-calculada.
- `TelaUnidadeAdmin` ganhou um dropdown pra filtrar os grupos de fala por
  nível (Iniciante/Básico/Intermediário/Avançado), necessário porque cada
  unidade agora tem até ~18 grupos.

**6. Admin — tela de Configurações** (`TelaConfiguracoesAdmin`, nova):
alternância de tema claro/escuro (reaproveita o `ThemeProvider` já
existente) e logout, acessível pela navbar do admin.

**7. Performance — `GET /api/Unidades/resumo`** (novo): o endpoint
`GET /api/Unidades` original devolve o grafo completo (todas as lições de
todas as 26 unidades) — ficou pesado depois da expansão de conteúdo
(**~2,5s** pra carregar). Telas que só precisam de nome/contagem
(Dashboard, Perfil) agora usam o endpoint resumido, que projeta só os
campos necessários direto no banco (**~160ms**, ~16x mais rápido). Telas
que precisam do conteúdo de verdade (`TelaInicioAtividadeUnidade`,
`TelaAtividadeFalaSessao`) continuam no endpoint completo — ver pendências
na seção 8 sobre otimizar essas também.

**8. Incidente operacional (resolvido, mas vale registrar)**: durante um
teste manual, o usuário saiu de uma atividade de fala enquanto a IA ainda
avaliava o áudio — o processo do Backend (`dotnet run`) travou por
completo (parou de responder a QUALQUER request, inclusive endpoints sem
relação nenhuma com fala). Investigado: não era lock de banco (SQL Server
sem sessões bloqueadas) nem as IAs (app_mms/app_llm respondendo normal) —
o próprio processo .NET ficou preso, provavelmente por esgotamento do
thread pool combinado com o volume alto de chamadas da importação em massa
feita pouco antes. O código do endpoint de fala em si está correto (usa
`await` em toda a cadeia, não segura transação de banco aberta durante a
chamada à IA). **Mitigação aplicada**: reiniciar o processo. **Não
investigado a fundo**: se isso é reproduzível de forma determinística ou
foi um caso raro de sobrecarga; vale considerar adicionar um
`CancellationToken` propagado do front (abortar a chamada HTTP se o
usuário navegar pra longe) como melhoria futura.

## 3. Como rodar tudo localmente

```bash
# IA — dois serviços, terminais separados
cd LipAI_LLM
venv\Scripts\activate
uvicorn app_mms:app --port 8000     # motor acústico (MMS-1b, baixa do HF na 1a vez)
uvicorn app_llm:app --port 8001     # portão da IA (RAG + adaptativo + feedback)

# Ollama é opcional (senão cai no feedback determinístico):
ollama serve
ollama pull qwen2.5:3b

# Back-end
cd Backend\BancodeDados
dotnet run --launch-profile https   # https://localhost:7268 — SEM o --launch-profile cai no profile "http" (5251), sem HTTPS, e o front não consegue falar com a API

# Front
cd Front
npm run dev                          # http://localhost:5173 (ou próxima porta livre)
```

**Certificado dev do .NET precisa estar confiável** no navegador, senão
toda chamada de API falha com erro de conexão:
`dotnet dev-certs https --trust`

`.env` do Front (`VITE_API_BASE_URL=https://localhost:7268/api`) — se não
existir, o `api.js` já cai nesse valor como padrão.

**Se o Backend parar de responder do nada** (sintoma: front trava em
"Carregando..." em tudo, inclusive telas sem relação com o que você estava
fazendo): mate o processo (`Get-NetTCPConnection -LocalPort 7268 | Stop-Process`)
e suba de novo com `dotnet run --launch-profile https`. Ver incidente
na seção 2.

## 4. Modelo de dados do back-end (o que existe hoje)

- `Usuario` — `IdUsuario, Nome, Email, SenhaHash, Diagnostico,
  NivelDificuldade (enum: Iniciante=1, Basico=2, Intermediario=3,
  Avancado=4), SaldoAtual (moedas), DiasSeguidos, UltimaAtividadeData,
  OfensivaCongeladaAte, MultiplicadorMoedasAte/Valor, ProfissionalId,
  EstadoAdaptativoIA (json)`
- `Profissional` — login separado, tem `Pacientes` (lista de `Usuario`)
- `Atividade` (categoria de topo, ex. "Leitura Labial") → tem `Unidades`
- `Unidade` → tem `LicoesFala`, `AtividadesFala`, `LicoesVideo`,
  `LicoesAlternativa`, `LicoesVibracao`
- `AtividadeFala` **(novo)** — agrupa `LicaoFala` por nome + nível
  (`{Nome, NivelDificuldade, UnidadeId, Exercicios: List<LicaoFala>}`)
- `LicaoFala { FraseEsperada, NivelDificuldade, ValorGanho, AtividadeFalaId (novo, nullable), Ordem (novo) }`
- `LicaoVideo { Titulo, VideoDescricao, VideoUrl }`
- `LicaoAlternativa { Pergunta, A, B, C, D, RespostaCerta, ValorGanho }`
- `LicaoVibracao { Silaba, Instrucao }`
- `ProgressoFala` / `ProgressoAlternativa` / `ProgressoVideo` /
  `ProgressoVibracao` **(novo)** — 1 registro por tentativa/conclusão por
  usuário; `ProgressoFala` tem `ScoreAcustico, FeedbackIA, DetalhesFonemasJson`
- `AtividadeSalva` — por Atividade de topo, não por lição
- `Categoria` → `Palavra { Nome, VideoUrl }` (dicionário, catálogo global)
- `Produto { Nome, Preco, Tipo (Cosmetico|BloqueioOfensiva|
  MultiplicadorMoedas), DuracaoDias, ValorMultiplicador }`,
  `ProdutoUsuario` (histórico de compra)
- `Conquista`, `ConquistaUsuario`
- `Notificacao { Descricao, Lida, DataCriacao }`
- `MensagemContato` (só `Mensagem`; nome/email vêm do usuário logado;
  restrito a role `"Usuario"` — profissional não consegue usar, ver
  pendências)

**Regra de acesso** (`Services/RegraNivelService.cs`) — ver seção 2,
item 1. Derruba com **403** quem tentar acessar sem nível suficiente.

## 5. Endpoints principais do back-end (`https://localhost:7268/api`)

```
POST   /Auth/login                                 {email, senha} -> {token, role, id, nome, email}
POST   /Usuario                                     cadastro (NÃO loga sozinho — front chama login depois)
GET    /Usuario | /Usuario/{id}                      PUT /Usuario/{id}  ·  DELETE /Usuario/{id}
POST   /Usuario/vincular-profissional

GET    /Unidades                                     grafo completo (todas as lições) — pesado, usar só quando precisa do conteúdo
GET    /Unidades/resumo                              NOVO — id/nome/contagens, sem conteúdo (rápido, usar como padrão)
GET    /Unidades/{id}  ·  POST  ·  PUT  ·  DELETE

POST/GET/PUT/DELETE  /Licao/alternativa[/{id}]
POST/GET/PUT/DELETE  /Licao/fala[/{id}]
POST/GET/PUT/DELETE  /Licao/video[/{id}]
POST/GET/PUT/DELETE  /Licao/vibracao[/{id}]

POST   /AtividadeFala                                NOVO — cria grupo de fala (Admin)
PUT    /AtividadeFala/{id}  ·  DELETE /AtividadeFala/{id}

POST   /Progresso/alternativa/{licaoId}/iniciar  ·  POST .../concluir
POST   /Progresso/fala/{licaoId}/iniciar  ·  POST .../concluir           multipart, campo "arquivo" -> nota+feedback+fonemas
POST   /Progresso/video/{licaoId}/concluir
POST   /Progresso/vibracao/{licaoId}/concluir                            NOVO
GET    /Progresso/fala/proximo-exercicio                                 motor adaptativo
GET    /Progresso/desempenho/{usuarioId}                                 {interpretacao, fala} em %
GET    /Progresso/usuario/{usuarioId}                                    inclui Alternativas/Falas/Videos/Vibracoes
GET    /Progresso/ofensiva/{usuarioId}

GET    /Categoria  ·  POST  ·  GET/{id}  ·  PUT/{id}  ·  DELETE/{id}
GET    /Dicionario?categoriaId=                       palavras (flat, com NomeCategoria)

GET    /Produto  ·  POST  ·  GET/{id}  ·  PUT/{id}  ·  DELETE/{id}
POST   /Produto/comprar                                {produtoId, quantidade}

GET    /Notificacoes/usuario/{usuarioId}  ·  PUT /Notificacoes/{id}      {lida: bool}

GET    /Atividades  ·  POST  ·  GET/{id}  ·  PUT/{id}  ·  DELETE/{id}    (nome do controller é plural!)
POST   /Atividades/item/salvar  ·  DELETE /Atividades/item/salvar/{tipoItem}/{itemId}  ·  GET /Atividades/item/salvos

POST   /Contato  (role Usuario só)  ·  GET /Contato (Admin)  ·  PUT /Contato/{id}

GET    /Conquista  ·  POST  ·  GET/{id}  ·  PUT/{id}  ·  DELETE/{id}
POST   /Conquista/conceder  ·  GET /Conquista/usuario/{usuarioId}        {atingidas, naoAtingidas}

GET    /Profissional  ·  POST  ·  GET/{id}  ·  PUT/{id}  ·  DELETE/{id}
GET    /Profissional/pacientes

GET    /Ia/health  ·  GET /Ia/dica-fonema?fonema=A
```

Todas exigem `Authorization: Bearer <token>` exceto login/cadastro/health.
**Resposta em camelCase** (`idUsuario`, `nivelDificuldade`...) — o front
normaliza com `?? objeto.Campo ?? objeto.campo` em vários lugares por
segurança.

## 6. Convenções do front-end (pra manter consistência)

- Pasta por componente/página: `index.jsx` + `index.css` + opcionais
  `index.hook.js` / `index.types.js` / `index.utils.js`.
- Toda chamada de API passa por `src/services/*Service.js`, que devolve
  sempre `{ sucesso: boolean, data?, mensagem? }` — nunca deixa o
  componente lidar com `try/catch` de axios diretamente.
- Tema: só usar tokens `var(--lipai-*)` (definidos em `src/index.css`),
  nunca hex fixo pra cor de superfície/texto/destaque. Modo escuro é
  tratado central em `src/styles/theme.css` + `ThemeProvider`
  (`src/hooks/useTheme.js`) — não criar override de dark mode dentro de
  telas específicas.
- `Botao`: usar a prop `variante` (`primario`/`secundario`/`perigo`)
  como padrão; `corDeFundo`/`corTexto`/`corBorda` só pra casos pontuais.
- Nomes em português no código (variáveis, props, classes CSS).
- `React` não precisa ser importado (React 19 + JSX transform novo).

## 7. O que NÃO foi feito ainda (pendências conhecidas, por prioridade)

1. **🔴 Segurança — chave Groq exposta no histórico do `LipAI_LLM/main`**
   (ver alerta na seção 1). Rotacionar a chave e decidir o que fazer com o
   histórico antes de considerar esse repo "limpo" pra produção.
2. **Login com Google** — pedido explicitamente pelo dono do projeto,
   **adiado por decisão dele** ("deixa isso do Google pra lá, depois a
   gente faz"). Decisão já tomada pra quando for implementado: email novo
   via Google **cria conta de aluno automaticamente** (nível Iniciante).
   Nada foi implementado ainda — nenhum pacote instalado, nenhuma env var,
   nenhum endpoint. Ponto de encaixe: `TelaLoginUser` (front) +
   `AuthController` (back, novo endpoint tipo `POST /Auth/google` que
   valida o id_token do Google e reusa o `JwtService` existente).
3. **LipAI_LLM** ainda não foi mergeado na `main` (branch
   `experimento/mms-estilo-colab`) — avaliar se o conteúdo dessa branch
   (normalização fonética, fix de forced-align) deve virar PR normal, já
   que os outros 2 repos agora vão direto pra main.
4. **Performance — ainda falta otimizar as telas "pesadas"**:
   `TelaInicioAtividadeUnidade` (tela onde o aluno escolhe a atividade) e
   `TelaAtividadeFalaSessao` ainda usam `GET /Unidades` completo (não o
   `/resumo`), porque precisam do conteúdo de verdade de uma unidade. Duas
   opções discutidas e ainda não implementadas: (a) carregar sob demanda
   só a unidade que o usuário abre (`GET /Unidades/{id}`, que já existe),
   em vez das 26 de uma vez; (b) paginar os grupos de fala dentro de uma
   unidade (hoje uma letra como "T" manda ~150 exercícios de uma vez).
5. **`TelaContatoMedico`** (contato do profissional) — `POST /Contato`
   exige role `"Usuario"`, profissional não consegue usar. Precisa ajuste
   no back se quiser abrir pra profissional.
6. **Lint pré-existente**: 15 erros (`react-hooks/purity`,
   `useRef(Date.now())` chamado durante o render) em `TelaAtividadeAlternativa`,
   `TelaAtividadeFala`, `TelaAtividadeFalaSessao`, `TelaAtividadeVideo` —
   já existiam antes desta sessão (vieram de um PR anterior), não quebram
   nada em runtime, mas é dívida técnica fácil de limpar.
7. Bundle do front está em ~550kB minificado — Vite avisa sobre isso;
   nada crítico, mas dá pra fazer code-splitting por rota no futuro.
8. Não há testes automatizados (unitários/integração) em nenhum dos 3
   repos — tudo foi verificado manualmente (ver seção 8), mas isso não
   fica no CI.
9. O "motor adaptativo" (`/ia/proximo-exercicio`, repetição espaçada por
   fonema) é um sistema de conteúdo **paralelo** ao sistema estático de
   `Unidade`/`AtividadeFala`/`LicaoFala` criado nesta sessão — os dois
   coexistem hoje e usam a mesma fonte (`banco_conteudo.json`), mas não
   estão unificados. Vale decidir, em algum momento, se o fluxo do aluno
   deve usar um, o outro, ou os dois pra coisas diferentes.

## 8. Como foi verificado (pra próxima pessoa/IA confiar no que está aqui)

Cada fase foi testada de verdade, não só lida:
- Back-end + IA: rodei os dois serviços Python + o back, criei usuário via
  API, gerei áudio falado por TTS, mandei pro `/Progresso/fala/.../concluir`
  e confirmei nota, transcrição, fonemas e feedback voltando certo e salvos
  no banco (testado com e sem Ollama).
- Front + back-end + IA: Playwright com Chrome real, microfone falso
  alimentado por WAV, logado de verdade, percorrendo a tela de fala até o
  resultado aparecer na UI.
- Front + back-end (fluxo do aluno): Playwright cobrindo cadastro → login
  automático → dashboard → dicionário → loja (compra real) →
  notificações → atividades salvas → interpretação → vídeo → contato —
  11 rotas, zero erro de console, zero 5xx.
- **Conteúdo por fonema (sessão atual)**: criado via chamadas reais à API
  Admin (não script local só gerando JSON) — verificado item a item: sem
  duplicados em nenhuma das 26 unidades (checado B, T, M em detalhe),
  níveis de dificuldade corretos por grupo, total de 2.981 exercícios de
  fala confirmado por query real no banco.
- **Progresso de vibração (sessão atual)**: testado end-to-end com usuário
  de teste — conclusão de vibração funcionando pra Iniciante, acesso a
  fala bloqueado (403) pra Iniciante, liberado depois de promover pra
  Básico via Admin, e `GetProgressoUsuario` devolvendo `Vibracoes`
  corretamente. Usuário de teste revertido pra Iniciante no final.
- **Endpoint resumido (sessão atual)**: comparado lado a lado com o
  completo na mesma chamada — 2553ms vs 161ms, mesmos 26 registros,
  números de contagem conferidos manualmente.

## 9. Detalhes internos: Motor Adaptativo e Controllers

### Motor Adaptativo (`adaptive_engine.py`)
- **Sistema Leitner (Caixas)**: 5 caixas (`NOVO`, `FRACO`, `APRENDENDO`,
  `BOM`, `DOMINADO`).
- **Pesos de Sorteio**: `FRACO` tem peso 6.0 (mais praticado), `DOMINADO`
  peso 0.5.
- **Limiar de Acerto**: avança de caixa só com score acústico `>= 70.0%`.
- **Janela Anti-Repetição**: `JANELA_ANTI_REPETICAO = 2`.
- **Pulos de Nível**: no "modo prova", `>= 90.0%` pula o nível de
  dificuldade do fonema automaticamente.

### Portão IA (`app_llm.py`)
- `langchain_ollama` (feedback) + `ChromaDB` com embeddings
  `all-MiniLM-L6-v2` (RAG de dicas fonéticas).
- Hifenização automática (nível 2) via `pyphen`.
- Totalmente stateless: recebe `estado_adaptativo` no payload, atualiza em
  memória durante o request, devolve o JSON atualizado pro back persistir.

### Progresso Back-end (`ProgressoController.cs`)
- Centraliza validação de segurança via `RegraNivelService` antes de
  iniciar/concluir qualquer atividade.
- A cada conclusão: salva score/feedback, calcula moedas (`ValorGanho`),
  aplica multiplicadores ativos, atualiza ofensiva, injeta notificação de
  sucesso. Tudo com `await` consistente — não segura transação aberta
  durante a chamada HTTP pra IA (ver incidente na seção 2, item 8, que foi
  investigado e descartado como causa de lock de banco).

## 10. Histórico de modificações (QA e correções)

- **Implementação do ConquistaToast**: componente e hook pra toast ao
  desbloquear conquista, interligado com o retorno da API no `/concluir`.
- **Injeção de dependência corrigida**: `AddScoped<ConquistaService>()` no
  `Program.cs` resolveu erro 500 no endpoint de progresso.
- **Prevenção de explosão cartesiana**: `.AsSplitQuery()` no
  `UnidadesController` evitou duplicação de itens ao listar fala/
  alternativa/vídeo juntos.
- **Correção de sincronismo React no InfoAtividades**: `useEffect` no
  `useInfoAtividade` resolveu bug visual de ícone de salvar perdendo
  estado após F5.
- **Correção de contagem de atividades salvas**: `TelaInicioAtividades`
  passou a contar lições (cards) de fato salvas, não o ID agrupado.
- **Cadastro de paciente pelo admin**: bug de níveis errados
  (`facil/medio/dificil`) **já corrigido** — usa `NIVEIS_DIFICULDADE` real.
- **`TelaInicioAtividades`**: já não usa mais array mock — conectada à
  API junto com o resto do fluxo do aluno.
- **Sessão atual**: ver seção 2 ("Sessão atual") pra tudo que foi feito
  — conteúdo por fonema, progresso de vibração, dica de fonema, filtro de
  nível no admin, tela de configurações do admin, endpoint resumido de
  unidades, e o incidente de travamento do backend (investigado e
  resolvido).
