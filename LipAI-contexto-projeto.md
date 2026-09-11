# LipAI — contexto do projeto (pra passar pra outra IA)

Documento gerado após uma sessão de trabalho cobrindo padronização do
front-end, integração com IA e conexão completa do front com o back-end.
Serve como brief técnico para continuar o desenvolvimento.

## 1. Visão geral — 3 repositórios

| Repo | Caminho local | Stack | Papel |
|---|---|---|---|
| **Front** | `C:\Users\Cintia\Desktop\Front` | React 19 + Vite + React Router 7 + axios + framer-motion + lucide-react | app do aluno/profissional/admin |
| **Backend** | `C:\Users\Cintia\source\repos\Backend\BancodeDados` | .NET 10, ASP.NET Core Web API, EF Core 9 + SQL Server (`LipaiDB` em `localhost\SQLEXPRESS`), JWT | API REST, dono do banco |
| **LipAI_LLM** | `C:\Users\Cintia\Desktop\LipAI_LLM` | Python 3.11, FastAPI, torch/torchaudio/transformers (MMS), LangChain + Chroma (RAG) + Ollama | IA: nota de pronúncia + feedback + lições adaptativas |

GitHub: `tcc-lipai/Front`, `tcc-lipai/Backend`, `tcc-lipai/LipAI_LLM`.
Usuário do git: `arthurgaelll`.

**Nenhum trabalho desta sessão foi enviado direto pra `main`** — tudo ficou
em branches. A única exceção é que o usuário (dona do projeto) mesma
mergeou o PR da branch de padronização do Front na `main` pelo GitHub
(`padronizacao/padronizacao-geral`, PR #68) — isso não foi feito pela IA,
foi decisão dela.

## 2. O que foi feito, em ordem cronológica

### Front — padronização (já mergeado na `main` via PR #68)
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

### Front — integração com a atividade de fala (branch `feat/integracao-atividade-fala`, ainda não mergeada)
`27cd8a7` — ligou a tela de fala ao back-end de ponta a ponta:
- `src/services/falaService.js`, `src/hooks/useGravadorAudio.js`
  (grava do microfone via `MediaRecorder`)
- `components/Fala` virou controlado (estados: ocioso/gravando/enviando/
  correto/incorreto/erro) — antes era um `setTimeout` fake com `Math.random`
- `TelaAtividadeFala` reescrita: carrega a lição real, grava, envia pro
  back-end, mostra nota + fonemas coloridos + feedback da IA
- `TelaInicioAtividadeUnidade` passou a listar unidades/lições reais
  (`GET /api/Unidades`)

### Front — integração completa da API pro fluxo do aluno (branch `feat/integracao-completa-api`, sai da de fala, ainda não mergeada)
`8439caf` — conectou o resto:
- **Bug real corrigido**: cadastro só tinha 3 níveis com valores errados
  (back tem 4) e **não fazia login depois de criar a conta** — ficava
  preso, parecia que "não funcionava". Corrigido: 4 níveis certos +
  login automático pós-cadastro.
- Serviços novos: `dicionarioService`, `produtoService`,
  `notificacaoService`, `atividadeService`, `contatoService`,
  `licaoService`, `progressoService`.
- Telas ligadas à API real: **Dashboard** (ofensiva, atividades recentes,
  conquistas, desempenho) — *Nota: a interface da Ofensiva foi restaurada para o layout original do Figma (calendário horizontal) mantendo a conexão com a API real*, **Dicionário**, **Loja** (o botão de comprar
  nem tinha `onClick` antes — corrigido), **Notificações**,
  **Atividades salvas**, **Atividade de Interpretação/Alternativa**,
  **Atividade de Vídeo**, **Contato** (a tela existia mas não tinha rota).
  `HeaderActions` (moedas/notificação) e `UserProfileDrawer` (dados do
  usuário) também passaram a buscar dados reais.
- Rotas novas/ajustadas: `/atividade/alternativa/:id` (era
  `/teste-atividade`, sem id), `/contato` (não existia).
- Testado fim a fim com Playwright (11 rotas do aluno, zero erro).

### Backend — integração com a IA (branch `feat/integracao-ia-completa`, ainda não mergeada)
`3494914` — o back chamava o MMS (motor acústico, porta 8000) **direto**
e só aproveitava nota+transcrição; a camada de LLM/RAG/motor adaptativo
(porta 8001) não era usada por ninguém. Agora:
- Back-end conversa só com `app_llm` (8001), que orquestra tudo.
- `HttpClient` nomeado `"IA"` com timeout de 120s (`Ia:BaseUrl` +
  `Ia:TimeoutSegundos` no `appsettings.json`).
- `POST /api/Progresso/fala/{id}/concluir` passa a devolver e persistir
  `ScoreAcustico`, `FeedbackIA`, `DetalhesFonemasJson` (colunas novas em
  `ProgressosFala`) e atualizar `Usuario.EstadoAdaptativoIA` (JSON do
  motor adaptativo: fonema atual, nível, caixinhas de repetição espaçada).
- `GET /api/Progresso/fala/proximo-exercicio` (novo) — próximo item da
  lição pelo motor adaptativo.
- `GET /api/Ia/dica-fonema` e `GET /api/Ia/health` (novo `IaController`)
  — repasse pro `app_llm`.
- Migration `IntegracaoIaFeedbackEEstadoAdaptativo` (4 colunas nullable,
  já aplicada no `LipaiDB`).
- `UnidadesController` passou a incluir `LicoesVibracao` (faltava).

`e9304f9` — fix real achado ao testar com áudio de navegador de verdade:
o `MediaRecorder` manda `Content-Type: audio/webm;codecs=opus`, e
`new MediaTypeHeaderValue(...)` não aceita parâmetros → `FormatException`
→ 500. Trocado por `MediaTypeHeaderValue.TryParse` com fallback.

`8c9bd78` — `Data/SeedData.cs`: popula o banco em Development (idempotente,
só insere o que falta) com conquistas, dicionário (categorias+palavras),
produtos da loja e uma trilha de conteúdo completa (unidades + lições de
fala/vídeo/alternativa/vibração). Roda sozinho no `Program.cs` quando
`app.Environment.IsDevelopment()`.

### LipAI_LLM — portão de IA (branch `feat/gateway-backend`, ainda não mergeada)
`67c7d97` — `app_llm.py` ganhou um grupo de rotas `/ia/*` **stateless**
pro back-end consumir (as rotas antigas `/treino/*` com estado em memória,
usadas pela `index.html` de teste, continuam intactas):
- `POST /ia/avaliar-fala` — recebe áudio + `texto_esperado` +
  `estado_adaptativo` (JSON); chama o MMS, roda o motor adaptativo, gera
  feedback; devolve nota, transcrição, fonemas, feedback e o
  `estado_adaptativo` atualizado. **Sem estado no servidor** — quem
  persiste é o back-end.
- `GET /ia/proximo-exercicio` — próximo item da lição a partir do estado.
- `GET /ia/dica-fonema?fonema=X` — dica articulatória via RAG (ChromaDB).
- `GET /ia/health` — status do MMS, do Ollama, do RAG e do banco de
  conteúdo.
- Feedback em linguagem natural: tenta o Ollama (`qwen2.5:3b`), se
  indisponível cai num **feedback determinístico por regras** (baseado na
  nota e nos fonemas errados) — nunca quebra por falta do LLM.
- `criar_rag.py` corrigido pra achar `Dica.docx` **e** `Dicas.docx`
  (3 fonemas — E/O/U — ficavam sem dica por causa do nome do arquivo).
- CORS corrigido (`allow_credentials=False` com `allow_origins=["*"]`).
- `.env.example`, README reescrito, `requirements.txt` com as versões de
  `langchain*` fixadas.

## 3. Estado atual das branches (todas empurradas pro GitHub, nenhuma na main exceto a já mergeada)

| Repo | Branch | Status |
|---|---|---|
| Front | `padronizacao/padronizacao-geral` | **já mergeada na `main`** (PR #68) |
| Front | `feat/integracao-atividade-fala` | sai da acima, 1 commit, não mergeada |
| Front | `feat/integracao-completa-api` | sai da de fala, 2 commits, não mergeada — **branch atual** |
| Backend | `feat/integracao-ia-completa` | sai da `main`, 3 commits, não mergeada |
| LipAI_LLM | `feat/gateway-backend` | sai da `main`, 1 commit, não mergeada |

Ordem de merge recomendada: Backend e LipAI_LLM podem mergear a qualquer
momento (não dependem de nada). No Front, a ordem tem que respeitar a
pilha: `feat/integracao-atividade-fala` → depois `feat/integracao-completa-api`
(ou as duas de uma vez, já que uma é base da outra).

## 4. Como rodar tudo localmente

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
dotnet run                           # https://localhost:7268

# Front
cd Front
npm run dev                          # http://localhost:5173 (ou próxima porta livre)
```

**Certificado dev do .NET precisa estar confiável** no navegador, senão
toda chamada de API falha com erro de conexão:
`dotnet dev-certs https --trust`

`.env` do Front (`VITE_API_BASE_URL=https://localhost:7268/api`) — se não
existir, o `api.js` já cai nesse valor como padrão.

## 5. Modelo de dados do back-end (o que existe hoje)

- `Usuario` — `IdUsuario, Nome, Email, SenhaHash, Diagnostico,
  NivelDificuldade (enum: Iniciante=1, Basico=2, Intermediario=3,
  Avancado=4), SaldoAtual (moedas), DiasSeguidos, UltimaAtividadeData,
  OfensivaCongeladaAte, MultiplicadorMoedasAte/Valor, ProfissionalId,
  EstadoAdaptativoIA (json, novo)`
- `Profissional` — login separado, tem `Pacientes` (lista de `Usuario`)
- `Atividade` (categoria de topo, ex. "Leitura Labial") → tem `Unidades`
- `Unidade` → tem `LicoesFala`, `LicoesVideo`, `LicoesAlternativa`,
  `LicoesVibracao`
- `LicaoFala { FraseEsperada, NivelDificuldade, ValorGanho }`
- `LicaoVideo { Titulo, VideoDescricao, VideoUrl }`
- `LicaoAlternativa { Pergunta, A, B, C, D, RespostaCerta, ValorGanho }`
- `LicaoVibracao { Silaba, Instrucao }`
- `ProgressoFala` / `ProgressoAlternativa` — 1 tentativa por lição por
  usuário; `ProgressoFala` tem `ScoreAcustico, FeedbackIA,
  DetalhesFonemasJson` (novos)
- `AtividadeSalva` — **por Atividade de topo, não por lição** (ex.: salvar
  "Leitura Labial" inteira, não uma lição específica)
- `Categoria` → `Palavra { Nome, VideoUrl }` (dicionário, catálogo global)
- `Produto { Nome, Preco, Tipo (Cosmetico|BloqueioOfensiva|
  MultiplicadorMoedas), DuracaoDias, ValorMultiplicador }`,
  `ProdutoUsuario` (histórico de compra)
- `Conquista`, `ConquistaUsuario`
- `Notificacao { Descricao, Lida, DataCriacao }`
- `MensagemContato` (só `Mensagem`; nome/email vêm do usuário logado)

**Regra de acesso** (`Services/RegraNivelService.cs`): usuário
`NivelDificuldade == Iniciante` só pode fazer atividades de **vibração**;
todo o resto (fala, vídeo, alternativa) exige nível Básico ou acima.
Isso derruba com **403** quem tentar sem nível suficiente — o front trata
isso nos services (`licaoService`, `progressoService`, `falaService`)
mostrando uma mensagem, mas vale lembrar ao testar.

## 6. Endpoints principais do back-end (`https://localhost:7268/api`)

```
POST   /Auth/login                              {email, senha} -> {token, role, id, nome, email}
POST   /Usuario                                  cadastro (NÃO loga sozinho — front chama login depois)
GET    /Usuario/{id}
PUT    /Usuario/{id}
GET    /Unidades                                 inclui LicoesFala/Video/Alternativa/Vibracao
GET    /Licao/fala/{id} | /video/{id} | /alternativa/{id} | /vibracao/{id}
POST   /Progresso/fala/{licaoId}/iniciar
POST   /Progresso/fala/{idProgresso}/concluir    multipart, campo "arquivo" -> nota+feedback+fonemas
GET    /Progresso/fala/proximo-exercicio         motor adaptativo (novo)
POST   /Progresso/alternativa/{licaoId}/iniciar
POST   /Progresso/alternativa/{idProgresso}/concluir   {respostaDada: "a"|"b"|"c"|"d"}
GET    /Progresso/desempenho/{usuarioId}         {interpretacao, fala} em %
GET    /Categoria                                dicionário (com Palavras)
GET    /Dicionario?categoriaId=                  palavras (flat, com NomeCategoria)
GET    /Produto
POST   /Produto/comprar                          {produtoId, quantidade}
GET    /Notificacoes/usuario/{usuarioId}
PUT    /Notificacoes/{id}                        {lida: bool}
GET    /Atividades                               (não "/Atividade" — nome do controller é plural!)
POST   /Atividades/salvar                        {atividadeId}
DELETE /Atividades/salvar/{atividadeId}
GET    /Atividades/salvas
POST   /Contato                                   {mensagem}
GET    /Conquista/usuario/{usuarioId}            {atingidas: [...], naoAtingidas: [...]}
GET    /Ia/health
GET    /Ia/dica-fonema?fonema=A
```

Todas exigem `Authorization: Bearer <token>` exceto login/cadastro/health.
**Resposta em camelCase** (`idUsuario`, `nivelDificuldade`...) — o front
normaliza com `?? objeto.Campo ?? objeto.campo` em vários lugares por
segurança.

## 7. Convenções do front-end (pra manter consistência)

- Pasta por componente/página: `index.jsx` + `index.css` + opcionais
  `index.hook.js` / `index.types.js` / `index.utils.js`.
- Toda chamada de API passa por `src/services/*Service.js`, que devolve
  sempre `{ sucesso: boolean, data?, mensagem? }` — nunca deixa o
  componente lidar com `try/catch` de axios diretamente.
- Tema: só usar tokens `var(--lipai-*)` (definidos em `src/index.css`),
  nunca hex fixo pra cor de superfície/texto/destaque. Modo escuro é
  tratado central em `src/styles/theme.css` — não criar override de dark
  mode dentro de telas específicas.
- `Botao`: usar a prop `variante` (`primario`/`secundario`/`perigo`)
  como padrão; `corDeFundo`/`corTexto`/`corBorda` só pra casos pontuais.
- Nomes em português no código (variáveis, props, classes CSS).
- `React` não precisa ser importado (React 19 + JSX transform novo).

## 8. O que NÃO foi feito ainda (pendências conhecidas)

- **Admin** (gestão de usuários/atividades/lições/produtos/conquistas
  pelo painel) e **Profissional** (visão de pacientes) — telas ainda
  usam dados mock, nunca foram ligadas à API.
- `TelaInicioAtividades` (a tela com filtro lateral de dificuldade/status)
  — ainda usa um array mock local, é redundante com
  `TelaInicioAtividadeUnidade` (que já foi ligada à API).
- Atividade de **vibração** e a tela `TelaAcompanhanteIA` — não foram
  ligadas (não há endpoint de progresso pra vibração no back, só
  `GET /Licao/vibracao/{id}` pra conteúdo).
- `TelaContatoMedico` (contato do profissional) — o endpoint
  `POST /Contato` exige role `"Usuario"`, então profissional não consegue
  usar; precisaria de ajuste no back se quiser abrir pra profissional.
- Cadastro de paciente pelo admin (`TelaPacienteCadastro`) — o `<select>`
  de nível ainda tem valores errados (`facil/medio/dificil` em vez do
  enum 1-4), igual o bug que foi corrigido no cadastro do aluno.
- Bundle do front está em ~550kB minificado — Vite avisa sobre isso;
  nada crítico, mas dá pra fazer code-splitting por rota no futuro.
- Não há testes automatizados (unitários/integração) em nenhum dos 3
  repos — tudo foi verificado manualmente com Playwright durante o
  desenvolvimento, mas isso não fica no CI.

## 9. Como a IA foi verificada (pra próxima pessoa/IA confiar no que está aqui)

Cada fase foi testada de verdade, não só lida:
- Back-end + IA: rodei os dois serviços Python + o back, criei usuário
  via API, gerei um áudio falado por TTS do Windows ("bom dia"), mandei
  pro `/Progresso/fala/.../concluir` e confirmei nota (96%), transcrição,
  fonemas e feedback (testado com e sem Ollama) voltando certo e sendo
  salvos no banco.
- Front + back-end + IA: usei Playwright com Chrome real, microfone
  falso (`--use-fake-device-for-media-stream` alimentado por um WAV),
  logado de verdade, e percorri a tela de fala até o resultado aparecer
  na UI.
- Front + back-end (resto do fluxo do aluno): Playwright cobrindo
  cadastro → login automático → dashboard → dicionário → loja (compra
  real) → notificações → atividades salvas → atividade de interpretação
  (resposta real, moedas creditadas) → vídeo → contato — 11 rotas, zero
  erro de console, zero 5xx.

## 10. Detalhes Internos: Motor Adaptativo e Controllers

Após análise do código fonte da Inteligência Artificial (`LipAI_LLM`) e do Back-end, aqui estão alguns detalhes técnicos importantes do funcionamento interno:

### Motor Adaptativo (`adaptive_engine.py`)
- **Sistema Leitner (Caixas)**: O motor usa um sistema de repetição espaçada baseado em 5 caixas (`NOVO`, `FRACO`, `APRENDENDO`, `BOM`, `DOMINADO`).
- **Pesos de Sorteio**: Itens na caixa `FRACO` têm o maior peso (6.0), forçando o aluno a praticar mais o que está errando. Itens `DOMINADO` têm peso baixo (0.5).
- **Limiar de Acerto**: Um fonema/palavra só avança de caixa se o score acústico (do MMS) for `>= 70.0%`.
- **Janela Anti-Repetição**: O algoritmo impede que o mesmo item seja servido seguidamente (`JANELA_ANTI_REPETICAO = 2`).
- **Pulos de Nível**: No "modo prova", se o aluno tirar `>= 90.0%`, o motor pula o nível de dificuldade do fonema automaticamente (ex: Nível 1 para Nível 2).

### Portão IA (`app_llm.py`)
- O servidor usa `langchain_ollama` (para feedback) e `ChromaDB` com embeddings `all-MiniLM-L6-v2` (para o RAG de dicas fonéticas).
- Hifenização automática para exercícios de nível 2 é feita pela biblioteca `pyphen`.
- É totalmente stateless (sem estado): recebe o JSON do `estado_adaptativo` no payload, atualiza na memória durante o request, e devolve o JSON atualizado para o back-end persistir.

### Progresso Back-end (`ProgressoController.cs`)
- Centraliza toda a validação de segurança. Garante que o aluno tenha acesso (através do `RegraNivelService`) antes de iniciar/concluir qualquer atividade de fala ou alternativa.
- A cada conclusão de atividade (`/concluir`), além de salvar o `ScoreAcustico` e `FeedbackIA` no banco, ele **calcula moedas** (`ValorGanho`), aplica eventuais multiplicadores ativos (`AplicarMultiplicador`), atualiza a ofensiva, e já injeta uma notificação de sucesso no banco de dados para o usuário ver.

## Histórico de Modificações (QA e Correções)
- **Implementação do ConquistaToast**: Criado o componente e hook para exibir toast notifications dinâmicas ao desbloquear conquistas no Front-end, interligado com o retorno da API no `/concluir`.
- **Injeção de Dependência Corrigida**: Adicionado `AddScoped<ConquistaService>()` no `Program.cs` para resolver erro 500 no endpoint de progresso.
- **Prevenção de Explosão Cartesiana (Cartesian Explosion)**: Refatorado `UnidadesController.cs` (adicionado `.AsSplitQuery()`) para evitar duplicação de itens na renderização do Front-end ao listar atividades de fala, alternativas e vídeo.
- **Correção de Sincronismo React no InfoAtividades**: Adicionado `useEffect` no `useInfoAtividade` para resolver bug visual em que o ícone de salvar perdia o estado após um F5.
- **Correção da Lógica de Contagem de Atividades Salvas**: A contagem do painel `TelaInicioAtividades` foi atualizada para contar as lições (cards) efetivamente salvos na visualização, e não apenas o parent ID agrupado do banco.
- **QA Geral Realizado**: Levantamento de dívidas técnicas sobre o fluxo de "Acesso Negado 403" para iniciantes e o uso de dados mockados nas páginas de Admin e Profissionais.
