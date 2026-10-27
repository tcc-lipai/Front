# LipAI — contexto do projeto (pra passar pra outra IA)

Documento gerado após várias sessões de trabalho cobrindo padronização do
front-end, integração com IA, conexão completa do front com o back-end,
criação de conteúdo pedagógico real (26 fonemas) e otimizações de
performance. Serve como brief técnico para a próxima IA/pessoa dar
continuidade — leia antes de sugerir próximos passos.

**Atualizado em**: 2026-10-26 (última sessão: auditoria de segurança
[chave JWT rotacionada, CORS restrito, rate limiting, senha mínima 8,
cabeçalhos] + widget de acessibilidade [contraste/tamanho de texto +
8 ferramentas extras: daltonismo, leitura em voz alta, reduzir animação,
destacar links, espaçamento, fonte de leitura, escala de cinza, cursor
grande]; ver "Sessão de 2026-10-26", "(parte 2)" e "(parte 3)" na seção 2).

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
| **LipAI_LLM** | `main` | `experimento/mms-estilo-colab` **já foi mergeada** (PR #1) — mas o histórico ainda tem a chave Groq, ver alerta abaixo |

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

### Sessão de 2026-10-19 — conteúdo pedagógico por fonema + nível de acesso + performance

Essa foi a sessão mais substancial depois da integração inicial. Resumo:

**1. Sistema de nível de acesso (já existia no código, só faltava conteúdo
pra valer a pena — e tinha um bug, ver sessão de 2026-10-22 mais abaixo)**
— `Services/RegraNivelService.cs` HOJE:
```csharp
PodeAcessarVibracao(nivel) => true; // vibração = nível 1, sempre liberada
PodeAcessarConteudo(nivelUsuario, nivelConteudo) => (int)nivelUsuario >= (int)nivelConteudo;
```
Acesso **cumulativo**: usuário só vê/acessa Fala, Interpretação e Vídeo com
nível `<=` o seu (Iniciante só Vibração, já que o conteúdo de Fala/
Interpretação/Vídeo começa em Básico). Aplicado no back
(`LicaoController.VerificarAcesso`, `ProgressoController`) e no front
(`TelaInicioAtividadeUnidade`, que filtra o conteúdo por nível antes de
exibir e mostra um banner pro Iniciante). **A versão binária antiga
(`PodeAcessarOutrosTipos`, só bloqueava Iniciante sem olhar o nível do
conteúdo) ainda existe no código só pro motor adaptativo de fala — ver
sessão de 2026-10-22.**

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

### Sessão de 2026-10-22 — acesso cumulativo por nível, progressão e desempenho

O usuário reportou, com print em mãos, um usuário **Básico** vendo e
conseguindo acessar grupos de Fala **Intermediário e Avançado** — bug real.
Investigando: `RegraNivelService.PodeAcessarOutrosTipos` só checava
`nivel != Iniciante`, nunca comparava com o nível do conteúdo específico.
Além disso `LicaoVideo` e `LicaoAlternativa` **nem tinham campo de nível**
no banco (só `LicaoFala` tinha). Essa sessão corrigiu isso e foi além,
implementando progressão de nível e exibição de desempenho:

**1. Acesso cumulativo de verdade**:
- Migration `AdicionaNivelVideoAlternativa`: `NivelDificuldade` adicionado
  em `LicaoVideo` e `LicaoAlternativa` (as 2 linhas pré-existentes foram
  marcadas como Básico por default).
- `RegraNivelService.PodeAcessarConteudo(nivelUsuario, nivelConteudo)` —
  substitui a checagem binária pra Fala/Alternativa/Vídeo (ver seção 1).
  Aplicado em `LicaoController` (os 3 `Get*PorId` passaram a buscar a
  lição ANTES de checar acesso, pra comparar nível real) e em
  `ProgressoController` (`IniciarAlternativa`, `IniciarFala`, e
  `ConcluirVideo`, que **não tinha NENHUMA checagem de nível antes** —
  bug de segurança à parte, corrigido também).
- Front (`TelaInicioAtividadeUnidade/index.hook.js`): `atividadesFala`,
  `licoesAlternativa` e `licoesVideo` agora são filtrados por
  `nivelDificuldade <= nivelUsuario` antes de normalizar pra exibição —
  antes a tela só escondia a SEÇÃO inteira por um booleano genérico,
  mostrando tudo dentro dela sem filtro nenhum.

**2. Progressão de nível** (`ProgressoController.cs`, novo):
- `GET /Progresso/nivel/elegibilidade` e `POST /Progresso/nivel/subir`.
- Regra: usuário sobe de nível quando completa **100% do conteúdo do
  nível atual** (Fala + Alternativa + Vídeo, "sem contar os anteriores" —
  filtro `NivelDificuldade == nivelAtual`, não `<=`) com **média de acerto
  >= 70%** entre Fala+Alternativa (Vídeo só precisa estar concluído, não
  tem "acerto"). Pra Iniciante→Básico o gate é só completar 100% da
  Vibração (não tem conceito de acerto nela).
- `POST /nivel/subir` **revalida tudo de novo no servidor** antes de
  aplicar — nunca confia em flag do front.
- Front: botão "Subir de nível" em `TelaInicioAtividadeUnidade`, aparece
  só quando elegível, mostra o nível de destino.

**3. Nível de acerto exibido em 3 níveis de granularidade** — métrica
usada em todo lugar: razão de tentativas `Correta=true` entre as
concluídas (mesma lógica que `GET /Progresso/desempenho` já usava pro
Dashboard, só que agora também por unidade/tipo/grupo). Vídeo e Vibração
**nunca** mostram "% de acerto" (não têm certo/errado), só "% concluído".
- Por atividade individual concluída: barra + porcentagem no
  `CardExercicio` (prop nova `acerto`) — pra Fala usa o `ScoreAcustico`
  real da tentativa, pra Alternativa é binário (100/0).
- Por grupo de Fala (`AtividadeFala`) e por tipo dentro da unidade: média
  calculada via `GET /Progresso/desempenho-unidades/{id}` (novo endpoint,
  agregação feita no banco com `COUNT`/`GroupBy`, não traz linha por
  linha pro client).
- Por unidade inteira: mesmo endpoint, campo `AcertoGeralUnidade`
  (combina Fala+Alternativa, exclui Vídeo/Vibração).

**4. Gráficos de desempenho** em `TelaInicioAtividades` (tela "Seu
progresso"): reusa o componente `BarrasDeDesempenho`, que já existia mas
tinha 2 bugs achados nesta sessão — cor de texto fixa pensada só pro modo
claro (ficava ilegível no escuro, já que a maioria do app roda em dark
mode) e a porcentagem calculada mas **nunca renderizada** (`<span>`
faltando). Os dois corrigidos; agora o texto usa `var(--lipai-text)` e a
% aparece ao lado de cada barra.

**5. Incidente de build no meio da sessão (sem gravidade)**: ao renomear
uma função dentro de `BarrasDeDesempenho.jsx`, o HMR do Vite pegou o
arquivo entre a mudança da declaração e a do call site — gerou um erro
transiente no console do navegador (`obterCoresPorLabel is not defined`).
Resolvido no próprio fluxo normal de edição (segunda edição corrigiu o
call site); registrado aqui só porque apareceu no log do Vite durante a
verificação, não porque seja um problema persistente.

Tudo commitado e enviado direto pra `main` no Front e no Backend. O
LipAI_LLM não teve mudança nesta sessão, só foi sincronizado localmente
com o que já estava em `origin/main` (tinha sido mergeado por PR
separadamente, fora desta sessão).

**Ainda não testado visualmente num navegador real** — a sessão não tinha
nenhuma ferramenta de automação de browser disponível. Verificação foi
100% via chamadas diretas à API (login como usuário de teste, promoção de
nível pelo Admin, checagem de 403 em conteúdo acima do nível, checagem de
elegibilidade/subida de nível, comparação de tempos do endpoint resumido).
**Setup em andamento**: o dono do projeto vai instalar o Playwright MCP
(`claude mcp add playwright -- npx -y @playwright/mcp@latest`) pra que a
próxima sessão consiga de fato abrir o Chrome e testar visualmente.

### Sessão de 2026-10-22 (parte 2) — limpeza de pendências

- **Lint zerado** (`npm run lint` passa sem erro): os 15 erros eram
  `react-hooks/purity` (`useRef(Date.now())` no render → agora `useRef(null)`
  + `useEffect` que grava o início) e `set-state-in-effect` (ajuste de estado
  durante o render em `ConquistaToast`/`FormModal`/`InfoAtividades`, reset
  de paginação nos setters em `PainelListaUsuarios`, e nos hooks Admin o
  carregamento virou efeito com `ativo` + contador `recarga`). Também saiu o
  estado `idProgresso` que nunca era lido.
- **Performance**: `TelaInicioAtividadeUnidade` agora lista as 26 unidades
  via `GET /Unidades/resumo` e só baixa o conteúdo de uma unidade
  (`GET /Unidades/{id}`) quando ela é aberta (cabeçalho vira botão; a
  primeira já vem aberta). `TelaAtividadeFalaSessao` usa o novo
  `GET /AtividadeFala/{id}` (nome + ids dos exercícios, com checagem de
  nível) em vez de baixar todas as unidades. **Ainda usa o grafo completo**:
  `TelaInicioAtividades` ("Seu progresso"), que precisa dos itens de todas
  as unidades pra calcular status — precisaria de um endpoint agregado.
- **Travamento do backend**: `ConcluirFala`, `ProximoExercicioFala` e o
  `IaController` propagam o `CancellationToken` da requisição até o
  `HttpClient` da IA (499 se o aluno desistiu, 504 se a IA demorou mais que
  o timeout); as avaliações acústicas simultâneas são limitadas a 3
  (`SemaphoreSlim`), o resto espera na fila (cancelável). No front,
  `concluirFala` recebe um `AbortController` que é abortado ao sair da tela.
  Testado com uma IA falsa lenta: o backend fecha a conexão com a IA ~no
  mesmo instante em que o cliente desiste, e segue respondendo normal.
- **Contato do profissional**: `MensagemContato` ganhou `ProfissionalId`
  (`UsuarioId` virou nullable; migration `ContatoDeProfissional`),
  `POST /Contato` aceita `Usuario` e `Profissional`, `GET /Contato` (admin)
  devolve também `origem` ("Aluno"/"Profissional"). `TelaContatoMedico`
  deixou de ser fake (só dava `alert`) e usa `enviarMensagemContato`.
  **Não testado de ponta a ponta com um profissional real** (sem login de
  admin pra criar um); compilou e o fluxo do aluno não mudou.
- **Bundle**: rotas com `React.lazy` + `Suspense`; entrada principal caiu de
  ~622 kB para ~321 kB.
- **Verificação em navegador real** (Chrome via Playwright, usuário Básico
  de teste, depois apagado): 26 unidades listadas, primeira abre sozinha,
  as demais baixam ao clicar, só aparece conteúdo Básico, sessão de fala
  abre e carrega exercício, nenhum erro de console além do 502 esperado da
  dica quando a IA está fora do ar. Backend devolve 403 pra grupo
  Intermediário com usuário Básico.
- **LipAI_LLM**: já estava mergeado na `main` (PR #1) — a pendência antiga
  estava desatualizada.
- **Motor adaptativo × sistema estático** (decisão ainda é do dono do
  projeto): recomendação = manter o sistema estático (unidades/grupos por
  nível) como fluxo principal do aluno e usar o motor adaptativo só pra
  uma modalidade "treino livre/revisão" por fonema fraco, que não depende
  de nível fixo. Nada foi mudado no código.

### Sessão de 2026-10-22 (parte 3) — área do profissional + testes ponta a ponta

- **Área do profissional (baseada no Figma)**: painel "Seus Pacientes" →
  "Ver" abre `/paciente/:id` (perfil, nível, Ativo/Não ativo, diagnóstico,
  *Desempenho Geral* com Interpretação/Fala = % de acerto e Vídeo/Acompanhante
  = % concluído, busca de unidades e uma lista com **unidades** — no lugar de
  "atividades" — com status e barra de progresso) → seta abre
  `/paciente/:id/unidade/:unidadeId` (desempenho da unidade por tipo e um bloco
  por grupo de fala com acerto, exercícios concluídos e nota média).
  Rotas antigas `/tela-paciente` e `/atividade-paciente/:id` (eram mock) saíram.
- **Backend**: `AcompanhamentoController` novo —
  `GET /api/Acompanhamento/paciente/{id}/unidades` e `.../unidades/{unidadeId}`.
  Só considera o conteúdo liberado pro nível do paciente; um grupo de fala só
  conta como concluído quando todos os exercícios foram acertados. Autorização:
  aluno só o próprio, profissional só pacientes vinculados, admin qualquer.
- **Guardas de rota**: rotas do aluno agora exigem papel `Usuario`; quem tenta
  entrar na área errada volta pra própria (profissional → `/dashboard-medico`).
  `HeaderActions`/`UserProfileDrawer` só buscam moedas/notificações pra aluno
  (antes o profissional gerava uma enxurrada de 403).
- **Correções da bateria de testes**: acerto por unidade nunca passa de 100%;
  conquista "Colecionador" + `novasConquistas` devolvidas por fala/alternativa/
  vídeo/compra (toast na Loja); `/Unidades/resumo` por nível do aluno e mesma
  contagem no Dashboard e em "Seu progresso"; excluir unidade/grupo (409 com
  mensagem se já há progresso); editar paciente no admin não desvincula mais do
  profissional; sessão de conta apagada volta pro login; nome/e-mail da sessão
  acompanham o que o admin alterou; grupo de fala vazio não aparece pro aluno;
  aquecimento do Ollama/MMS no startup (`app_llm.py`, commit local no
  LipAI_LLM ainda sem push); animação de abrir/fechar unidade na trilha.
- **Pendências novas**: não há formulário de Vibração no admin; vídeos do
  dicionário/interpretação/vídeo-aula ainda sem conteúdo (previsto pela equipe).

### Sessão de 2026-10-22 (parte 4) — até 3 profissionais por aluno

- **Modelo**: `Usuario.ProfissionalId` virou a tabela de vínculo
  `VinculosProfissional (UsuarioId, ProfissionalId, DataVinculo)`, máximo 3 por
  aluno (`VinculoProfissional.Maximo`). Migration `VinculosProfissional` copia os
  vínculos antigos antes de apagar a coluna. Excluir aluno ou profissional apaga
  só os vínculos (cascade).
- **Aluno** (Perfil → Configurações → "Profissionais vinculados", componente
  `ProfissionaisVinculados`): lista os vinculados (n/3), vincula por código,
  desvincula com confirmação. API: `GET /Usuario/meus-profissionais`,
  `POST /Usuario/vincular-profissional`, `DELETE /Usuario/meus-profissionais/{id}`.
- **Admin**: no cadastro/edição do paciente o campo aceita até 3 códigos
  separados por vírgula e **substitui o conjunto**; vazio desvincula de todos.
- Todas as checagens "é paciente deste profissional" (acompanhamento, progresso,
  conquistas, notificações) passaram a olhar a tabela de vínculos.
- Conta de demonstração do profissional: `prof.demo@lipai.com` / `Prof@12345`
  (código TCRD7H), já vinculada ao aluno `gaelpinhoarthur@gmail.com`.

### Sessão de 2026-10-26 — auditoria de segurança

Pedido do dono do projeto: testar segurança de rotas/geral e sugerir
melhorias. Li todos os controllers, `Program.cs`, `JwtService`, os DTOs
de cadastro/edição, e o histórico do Git do Backend. Achado mais grave
primeiro:

**1. 🔴 A chave de assinatura JWT em uso estava exposta no histórico
público do GitHub** — `appsettings.json` foi commitado nos primeiros
commits do repo (`24ed2c2`, `6bbde68`, `c23d3bc`, `f4ffe75`), removido do
tracking depois (está no `.gitignore` hoje), mas **o blob antigo continua
alcançável a partir de `origin/main`**. Comparei o hash da chave desses
commits com a chave que estava em uso: **era a mesma, nunca tinha sido
trocada**. Ou seja, qualquer um que baixasse o histórico do repo
conseguia forjar um token JWT válido pra qualquer usuário (inclusive
Admin) sem senha nenhuma. **Corrigido**: gerei uma chave nova
(64 bytes aleatórios, `RandomNumberGenerator`) e troquei em
`appsettings.json` (local, gitignored, não entra em commit). **Efeito
colateral esperado**: todo mundo que estava logado foi deslogado (token
antigo não valida mais com a chave nova) — inclusive o usuário de teste
e o Admin, precisei logar de novo pra continuar testando.
A senha do Admin **não foi trocada** (pedido explícito do dono do
projeto — só a chave).

**2. CORS totalmente aberto** (`AllowAnyOrigin`) — trocado por uma lista
configurável (`Cors:AllowedOrigins` em `appsettings.json`, hoje só
`http://localhost:5173`; `appsettings.Example.json` atualizado com o
mesmo formato). Testado: origem na lista recebe
`Access-Control-Allow-Origin`, origem fora da lista não recebe nada
(bloqueio acontece no navegador). **Quando for pra produção, adicionar o
domínio real nessa lista.**

**3. Sem rate limiting no login** — adicionado `AddRateLimiter` em
`Program.cs` com uma política `"login"` (fixed window, 5 tentativas por
minuto por IP, `RateLimitPartition.GetFixedWindowLimiter` particionado
por `RemoteIpAddress`, 429 ao estourar), aplicada via
`[EnableRateLimiting("login")]` em `AuthController.Login`. Testado de
verdade: 5 tentativas erradas passam (401), a 6ª vira 429; esperei a
janela de 1 minuto resetar e confirmei de novo limpo.

**4. Senha mínima de 6 → 8 caracteres** — `UsuarioCadastroDto` e
`ProfissionalCadastroDto` (`[MinLength(8)]`, antes era 6); também
adicionei a validação (que **não existia nenhuma**) no campo opcional de
troca de senha em `UsuarioEdicaoAdminDto` e `ProfissionalEdicaoDto`.
Texto do placeholder no Front (`TelaProfissionalCadastro`) atualizado.

**5. Sem cabeçalhos de segurança** — middleware simples em `Program.cs`
adicionando `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` e
`Referrer-Policy: strict-origin-when-cross-origin` em toda resposta.
Testado via request crua, os 3 cabeçalhos aparecem.

**O que a auditoria confirmou que já estava correto** (vale saber, não
é só lista de problema): senha com BCrypt (nunca texto puro); sem SQL
injection (EF Core parametrizado em tudo, nenhum SQL cru no projeto);
sem XSS óbvio no Front (nenhum `dangerouslySetInnerHTML`); mensagem de
erro de login genérica pros 3 tipos de conta (não dá pra descobrir se
um e-mail existe); `AcompanhamentoController` e
`UsuarioController.GetUsuarioPorId` checam IDOR corretamente (paciente
só vê o próprio, profissional só paciente vinculado); `RotaProtegida`
no Front é só UX, a segurança de verdade já estava no back.

**Não testado visualmente** (mesma limitação de sempre — sem navegador
na sessão até o momento desta auditoria). Testado 100% via requisições
diretas (PowerShell), incluindo o próprio rate limiting de ponta a ponta.

**Pendência que ficou pra depois, não é bug**: a senha do Admin usada
neste projeto é fraca/previsível — o dono do projeto pediu explicitamente
pra não mexer nela por enquanto.

### Sessão de 2026-10-26 (parte 2) — widget de acessibilidade

Pedido do dono do projeto: além do VLibras (já existia, ver sessão de
2026-10-23), uma "caixinha" flutuante de acessibilidade com alto
contraste e aumento de texto, igual as que já existem em outros sites.

- **Novo**: `src/components/AcessibilidadeProvider/` (Context, mesmo
  padrão do `ThemeProvider` — `index.jsx`, `themeContext.js`,
  `index.types.js` com `NIVEIS_FONTE`) + hook
  `src/hooks/useAcessibilidade.js` + `src/components/WidgetAcessibilidade/`
  (botão flutuante canto inferior esquerdo + painel). Montado em
  `App.jsx`, fora das rotas — aparece em toda tela, logado ou não.
- **Tamanho do texto** (4 níveis: Normal/Grande/Maior/Máximo) — decisão
  técnica importante: escala a página **inteira** via `zoom` no `<html>`
  (`data-fonte="grande|maior|maximo"` em `src/index.css`), não só o
  `font-size`. O motivo: o CSS do projeto usa `px` fixo espalhado em
  dezenas de arquivos, não dava pra escalar só o texto sem reescrever
  tudo pra `rem` (fora de escopo). `zoom` reflui o layout de verdade
  (diferente de `transform: scale`, que cortaria conteúdo).
- **Alto contraste** — mesmo mecanismo do tema claro/escuro: atributo
  `data-contraste="alto"` no `<html>` sobrescrevendo os tokens
  `var(--lipai-*)` com paleta preto/branco/amarelo. Independente do
  tema claro/escuro (dá pra combinar os dois). Cobre bem telas que já
  usam só tokens; **igual aconteceu com o dark mode** (que precisou de
  ~540 linhas de override em `theme.css` pra telas com cor fixa), é
  esperado que alguma tela específica precise de ajuste pontual depois
  — não foi feita uma varredura tela por tela.
- Preferências em `localStorage`
  (`lipai-acessibilidade-fonte`/`lipai-acessibilidade-contraste`),
  mesmo padrão do `lipai-theme`.
- **Verificação**: `npx eslint src` (0 erros, projeto inteiro) e
  `npm run build` (sucesso) — **não verificado visualmente num
  navegador real** (sessão sem Playwright MCP conectado até este
  ponto, apesar do dono do projeto ter tentado configurar). Checagem
  manual feita: nenhum outro elemento fixo ocupa o canto inferior
  esquerdo da tela (VLibras fica no inferior direito por padrão).

### Sessão de 2026-10-26 (parte 3) — bug do contraste + 8 ferramentas novas

O dono do projeto testou e o alto contraste não mudava nada na tela.
Causa: `theme.css` (o arquivo que força cor em telas com CSS legado, feito
originalmente só pro modo escuro) só disparava com `data-theme="dark"`,
nunca com `data-contraste="alto"`. Como quase toda regra de lá já usa
`var(--lipai-*) !important` (não cor fixa), a correção foi ampliar o
seletor gatilho de `:root[data-theme="dark"]` pra
`:root:is([data-theme="dark"], [data-contraste="alto"])` em **todo** o
arquivo (`replace_all`), sem precisar reescrever cor nenhuma — exceto o
bloco que força a landing page a ficar clara no escuro, que continua só
em `data-theme="dark"` (é estética, não acessibilidade; alto contraste
deve continuar valendo lá).

Depois disso, a pedido do dono do projeto, **8 ferramentas novas** no
mesmo widget (todas via `TOGGLES_ACESSIBILIDADE` em
`AcessibilidadeProvider/index.types.js` — lista genérica de
`{chave, label}`, cada uma vira `data-<chave>="true"` no `<html>` via
`dataset`, sem precisar repetir a lógica de estado 8 vezes):

- **Modo daltônico** — troca o par vermelho/verde (pior pra daltonismo)
  por azul/laranja (o par mais distinguível pra todos os tipos). Cobre os
  tokens `--lipai-danger`/`--lipai-success` **e** o estado certo/errado de
  `TelaAtividadeAlternativa` (`.option-item.correct`/`.incorrect`), que
  usava cor fixa, não token. **Além disso, independente do toggle**,
  `option-item` ganhou um ícone ✓/✗ (lucide `Check`/`X`) ao lado do texto
  — achado real da sessão: antes só a cor (verde/vermelho) indicava certo/
  errado, inacessível pra quem tem daltonismo vermelho-verde mesmo sem
  ativar o modo.
- **Ler texto em voz alta** — `SpeechSynthesisUtterance` (Web Speech API,
  nativa do navegador) lendo o texto do elemento clicado; ignora clique em
  `input`/`textarea`/`select` pra não atrapalhar digitação.
- **Reduzir animação** — CSS (`animation-duration`/`transition-duration`
  quase zero, padrão `prefers-reduced-motion`) cobre transições de CSS;
  as transições de **página** são do framer-motion (JS, não CSS), então
  também foi adicionado `<MotionConfig reducedMotion={...}>` envolvendo
  `<AnimatePresence>` em `routes.jsx`, lendo o toggle via
  `useAcessibilidade()` dentro de `AnimatedRoutes`.
- **Destacar links e botões** — sublinhado forte em link, contorno em
  botão.
- **Aumentar espaçamento** — `letter-spacing`/`line-height`/`word-spacing`.
- **Fonte de leitura facilitada** — troca pra "Atkinson Hyperlegible"
  (fonte do Braille Institute, feita pra baixa visão; import novo no
  Google Fonts em `src/index.css`).
- **Escala de cinza** — `filter: grayscale(1)` no `:root`.
- **Cursor grande** — seta SVG inline (data URI) maior que o padrão,
  contorno branco pra ficar visível em qualquer fundo.
- **Verificação**: `npx eslint src` (0 erros) e `npm run build` (sucesso,
  inclusive grep manual no CSS compilado confirmando que o seletor do
  cursor/daltonismo/fonte saíram certos do build). **Ainda sem navegador
  conectado nesta sessão** — nenhuma das 8 ferramentas novas foi vista
  rodando de verdade, só validada por leitura de código + build.

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
- `LicaoVideo { Titulo, VideoDescricao, VideoUrl, NivelDificuldade (novo em 2026-10-22) }`
- `LicaoAlternativa { Pergunta, A, B, C, D, RespostaCerta, ValorGanho, NivelDificuldade (novo em 2026-10-22) }`
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
GET    /Progresso/desempenho/{usuarioId}                                 {interpretacao, fala} em % (geral da conta)
GET    /Progresso/desempenho-unidades/{usuarioId}                        NOVO (2026-10-22) — acerto/concluído por unidade e por tipo
GET    /Progresso/nivel/elegibilidade                                    NOVO (2026-10-22) — {nivelAtual, proximoNivel, elegivel}
POST   /Progresso/nivel/subir                                            NOVO (2026-10-22) — revalida no servidor e aplica
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
   histórico antes de considerar esse repo "limpo" pra produção. (A chave
   JWT do Backend tinha o mesmo problema — **essa já foi corrigida** na
   sessão de 2026-10-26, ver seção 2. A da Groq continua pendente.)
2. **Login com Google** — pedido explicitamente pelo dono do projeto,
   **adiado por decisão dele** ("deixa isso do Google pra lá, depois a
   gente faz"). Decisão já tomada pra quando for implementado: email novo
   via Google **cria conta de aluno automaticamente** (nível Iniciante).
   Nada foi implementado ainda — nenhum pacote instalado, nenhuma env var,
   nenhum endpoint. Ponto de encaixe: `TelaLoginUser` (front) +
   `AuthController` (back, novo endpoint tipo `POST /Auth/google` que
   valida o id_token do Google e reusa o `JwtService` existente).
3. ~~LipAI_LLM sem merge na main~~ — resolvido (PR #1 mergeado).
4. **Performance restante**: `TelaInicioAtividades` ainda usa `GET /Unidades`
   completo (ver parte 2 da sessão de 2026-10-22), e uma unidade como "T"
   ainda manda ~150 exercícios de uma vez ao ser aberta (paginar os grupos).
5. ~~Verificação visual em navegador~~ — feita na parte 2 da sessão de
   2026-10-22 pra a tela de unidades e a sessão de fala. **Ainda não
   verificado visualmente**: gráficos de "Seu progresso", botão "Subir de
   nível" no caminho elegível e as barras de acerto com progresso real.
6. ~~Contato do profissional~~ — resolvido (parte 2). Falta testar com um
   profissional real.
7. ~~Lint pré-existente~~ — resolvido, `npm run lint` passa.
8. ~~Bundle grande~~ — resolvido com code-splitting por rota (~321 kB).
9. Não há testes automatizados (unitários/integração) em nenhum dos 3
   repos — tudo foi verificado manualmente (ver seção 8), mas isso não
   fica no CI.
10. O "motor adaptativo" (`/ia/proximo-exercicio`, repetição espaçada por
    fonema) é um sistema de conteúdo **paralelo** ao sistema estático de
    `Unidade`/`AtividadeFala`/`LicaoFala`. Os dois coexistem hoje e usam a
    mesma fonte (`banco_conteudo.json`), mas não estão unificados. O
    motor adaptativo também ainda usa a checagem binária antiga de nível
    (`PodeAcessarOutrosTipos`, não a cumulativa nova) porque não tem uma
    lição específica pra comparar — vale revisar se isso é um problema
    real (ele já bloqueia Iniciante corretamente, só não escala por nível
    pros demais, mas também não tem "níveis" de conteúdo fixo pra
    comparar, já que gera dinamicamente). Vale decidir, em algum momento,
    se o fluxo do aluno deve usar o motor adaptativo, o sistema estático,
    ou os dois pra coisas diferentes.
11. **Senha do Admin fraca/previsível** — identificado na auditoria de
    segurança (2026-10-26), dono do projeto pediu explicitamente pra não
    trocar por enquanto. Trocar quando for pra produção de verdade.
12. ~~Acessibilidade — widget de contraste/tamanho de fonte~~ — resolvido
    (parte 2 da sessão de 2026-10-26). **Não verificado visualmente**
    (sem navegador na sessão) e **sem varredura de alto contraste em
    todas as telas** — só os tokens globais, igual explicado na seção 2.

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
- **Conteúdo por fonema (sessão de 2026-10-19)**: criado via chamadas reais à API
  Admin (não script local só gerando JSON) — verificado item a item: sem
  duplicados em nenhuma das 26 unidades (checado B, T, M em detalhe),
  níveis de dificuldade corretos por grupo, total de 2.981 exercícios de
  fala confirmado por query real no banco.
- **Progresso de vibração (sessão de 2026-10-19)**: testado end-to-end com usuário
  de teste — conclusão de vibração funcionando pra Iniciante, acesso a
  fala bloqueado (403) pra Iniciante, liberado depois de promover pra
  Básico via Admin, e `GetProgressoUsuario` devolvendo `Vibracoes`
  corretamente. Usuário de teste revertido pra Iniciante no final.
- **Endpoint resumido (sessão de 2026-10-19)**: comparado lado a lado com
  o completo na mesma chamada — 2553ms vs 161ms, mesmos 26 registros,
  números de contagem conferidos manualmente.
- **Acesso cumulativo por nível (sessão de 2026-10-22)**: usuário de teste
  promovido/rebaixado via Admin entre Iniciante/Básico/Intermediário,
  confirmando em cada nível: 403 em `GET /Licao/fala/{id}` e
  `POST /Progresso/.../iniciar` pra conteúdo acima do nível, 200 pra
  conteúdo no nível ou abaixo, e `ConcluirVideo` (que antes não tinha
  checagem nenhuma) bloqueando corretamente. `GET /Progresso/nivel/
  elegibilidade` testado retornando `elegivel: false` com usuário recém-
  criado e `POST /nivel/subir` retornando 400 nessa condição (rejeita
  tentativa sem ter completado o nível). **Não testado**: o caminho
  "completo e elegível" de ponta a ponta (exigiria terminar todo o
  conteúdo de um nível inteiro com um usuário de teste, não foi feito por
  tempo — a lógica foi validada por inspeção de código + os casos de
  borda acima).
- **Auditoria de segurança (sessão de 2026-10-26)**: chave JWT comparada
  por hash entre o histórico do Git e o valor em uso (confirmado que era
  a mesma antes de trocar); rate limiting testado de ponta a ponta (5
  tentativas passam, 6ª vira 429, confirmado de novo após a janela
  resetar); CORS testado com request crua (`Origin` permitida recebe
  `Access-Control-Allow-Origin`, não-permitida não recebe); cabeçalhos
  de segurança confirmados na resposta real. IDOR checado por leitura de
  código em `AcompanhamentoController` e `UsuarioController` (não testado
  via requisição real com dois usuários diferentes, só inspeção).

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
- **Sessão de 2026-10-19**: conteúdo por fonema, progresso de vibração,
  dica de fonema, filtro de nível no admin, tela de configurações do
  admin, endpoint resumido de unidades, e o incidente de travamento do
  backend (investigado e resolvido). Ver seção 2.
- **Sessão de 2026-10-22**: corrigido o bug de acesso por nível não
  cumulativo (usuário Básico via conteúdo de qualquer nível), adicionado
  `NivelDificuldade` em Vídeo/Alternativa (faltava), sistema de
  progressão de nível, exibição de acerto em 3 granularidades (atividade/
  tipo/unidade) e gráficos de desempenho — incluindo 2 bugs corrigidos no
  componente `BarrasDeDesempenho` (texto ilegível no modo escuro, % nunca
  renderizada). Ver seção 2.
- **Sessão de 2026-10-23**: implementação de acessibilidade no frontend
  com a adição do **VLibras Widget** (`vlibras-plugin.js`) no `index.html`,
  disponibilizando tradução automática para Libras com avatar 3D em todas as telas da aplicação.
- **Sessão de 2026-10-26**: auditoria de segurança completa — chave JWT
  rotacionada (estava exposta no histórico público do GitHub, era a
  mesma em uso), CORS restrito a origens conhecidas, rate limiting no
  login (5/min por IP), senha mínima 6→8 caracteres (cadastro e edição,
  incluindo um campo que não tinha validação nenhuma), cabeçalhos de
  segurança adicionados. Ver seção 2.
- **Sessão de 2026-10-26 (parte 2)**: widget de acessibilidade flutuante
  (`AcessibilidadeProvider` + `WidgetAcessibilidade`) — 4 níveis de
  tamanho de texto via `zoom` e alto contraste via override dos tokens
  `var(--lipai-*)`, mesmo padrão do `ThemeProvider`. Ver seção 2.
