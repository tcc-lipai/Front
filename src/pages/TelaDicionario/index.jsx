import { BookOpen, Search, Star, ChevronDown, Video } from 'lucide-react';
import { useTelaDicionario } from './index.hook';
import Navbar from '../../components/Navbar/index';
import './index.css';

const CATEGORIAS = [
  { chave: 'substantivo', label: 'Substantivo' },
  { chave: 'verbo',       label: 'Verbo'       },
  { chave: 'adjetivo',    label: 'Adjetivo'    },
  { chave: 'expressao',   label: 'Expressão'   },
  { chave: 'cumprimento', label: 'Cumprimento' },
];

const TelaDicionario = () => {
  const {
    palavrasFiltradas,
    letrasComPalavra,
    letras,
    busca,
    letraAtiva,
    categoriaAtiva,
    apenasFlavoritos,
    temFiltroAtivo,
    palavraSelecionada,
    handleBusca,
    handleLetra,
    handleCategoria,
    handleToggleFavoritos,
    handleToggleFavorito,
    handleSelecionarPalavra,
    handleLimparFiltros,
  } = useTelaDicionario();

  /* Agrupa palavras por letra inicial */
  const grupos = palavrasFiltradas.reduce((acc, p) => {
    const letra = p.palavra[0].toUpperCase();
    if (!acc[letra]) acc[letra] = [];
    acc[letra].push(p);
    return acc;
  }, {});

  const gruposOrdenados = Object.keys(grupos).sort();

  return (
    <div className="dicionario-layout">
      {/* Navbar na esquerda */}
      <Navbar />
      
      {/* Conteúdo principal do dicionário */}
      <div className="dicionario">
        {/* Cabeçalho */}
        <header className="dicionario__header">
          <div className="dicionario__header-topo">
            <div className="dicionario__icone" aria-hidden="true">
              <BookOpen size={24} color="#fff" />
            </div>
            <div>
              <h1 className="dicionario__titulo">Dicionário</h1>
              <p className="dicionario__subtitulo">
                Consulte palavras e expressões com dicas de leitura labial
              </p>
            </div>
          </div>

          {/* Busca */}
          <div className="dicionario__busca-wrapper">
            <span className="dicionario__busca-icone" aria-hidden="true">
              <Search size={16} />
            </span>
            <input
              className="dicionario__busca"
              type="search"
              placeholder="Buscar palavra ou expressão..."
              value={busca}
              onChange={(e) => handleBusca(e.target.value)}
              aria-label="Buscar palavra ou expressão no dicionário"
            />
          </div>
        </header>

        <div className="dicionario__corpo">
          {/* Índice alfabético */}
          <nav className="dicionario__alfabeto" aria-label="Índice alfabético">
            {letras.map((letra) => (
              <button
                key={letra}
                className={`dicionario__letra-btn${letraAtiva === letra ? ' dicionario__letra-btn--ativa' : ''}`}
                onClick={() => handleLetra(letra)}
                disabled={!letrasComPalavra.has(letra)}
                aria-label={`Filtrar pela letra ${letra}`}
                aria-pressed={letraAtiva === letra}
              >
                {letra}
              </button>
            ))}
          </nav>

          {/* Conteúdo principal */}
          <main className="dicionario__main" aria-label="Lista de palavras do dicionário">
            {/* Filtros de categoria */}
            <div className="dicionario__categorias" role="group" aria-label="Filtrar por categoria">
              {CATEGORIAS.map(({ chave, label }) => (
                <button
                  key={chave}
                  className={`dicionario__categoria-btn${categoriaAtiva === chave ? ' dicionario__categoria-btn--ativa' : ''}`}
                  onClick={() => handleCategoria(chave)}
                  aria-pressed={categoriaAtiva === chave}
                >
                  {label}
                </button>
              ))}
              <button
                className={`dicionario__favoritos-btn${apenasFlavoritos ? ' dicionario__favoritos-btn--ativo' : ''}`}
                onClick={handleToggleFavoritos}
                aria-pressed={apenasFlavoritos}
                aria-label="Mostrar apenas favoritos"
              >
                <Star size={13} />
                Favoritos
              </button>
            </div>

            {/* Barra de info */}
            <div className="dicionario__info-bar">
              <span className="dicionario__contagem" aria-live="polite">
                {palavrasFiltradas.length}{' '}
                {palavrasFiltradas.length === 1 ? 'palavra encontrada' : 'palavras encontradas'}
              </span>
              {temFiltroAtivo && (
                <button
                  className="dicionario__limpar"
                  onClick={handleLimparFiltros}
                  aria-label="Limpar todos os filtros"
                >
                  Limpar filtros
                </button>
              )}
            </div>

            {/* Lista agrupada por letra */}
            {gruposOrdenados.length > 0 ? (
              <div className="dicionario__lista" role="list">
                {gruposOrdenados.map((letra) => (
                  <div key={letra} className="dicionario__grupo" role="listitem">
                    <h2 className="dicionario__grupo-letra" aria-label={`Palavras com a letra ${letra}`}>
                      {letra}
                    </h2>
                    {grupos[letra].map((palavra) => {
                      const expandido = palavraSelecionada?.id === palavra.id;
                      return (
                        <article
                          key={palavra.id}
                          className={`dicionario__card${expandido ? ' dicionario__card--expandido' : ''}`}
                          tabIndex={0}
                          role="button"
                          aria-expanded={expandido}
                          aria-label={`${palavra.palavra}: ${palavra.descricao}`}
                          onClick={() => handleSelecionarPalavra(palavra)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleSelecionarPalavra(palavra);
                            }
                          }}
                        >
                          {/* Topo do card */}
                          <div className="dicionario__card-topo">
                            <span className="dicionario__card-palavra">{palavra.palavra}</span>
                            <div className="dicionario__card-acoes">
                              <span className="dicionario__card-categoria">
                                {CATEGORIAS.find((c) => c.chave === palavra.categoria)?.label ?? palavra.categoria}
                              </span>
                              <button
                                className={`dicionario__card-favorito${palavra.favorito ? ' dicionario__card-favorito--ativo' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleFavorito(palavra.id);
                                }}
                                aria-label={palavra.favorito ? `Remover ${palavra.palavra} dos favoritos` : `Adicionar ${palavra.palavra} aos favoritos`}
                                aria-pressed={palavra.favorito}
                              >
                                <Star size={15} fill={palavra.favorito ? 'currentColor' : 'none'} />
                              </button>
                              <span
                                className={`dicionario__card-expandir${expandido ? ' dicionario__card-expandir--aberto' : ''}`}
                                aria-hidden="true"
                              >
                                <ChevronDown size={16} />
                              </span>
                            </div>
                          </div>

                          {/* Descrição */}
                          <p className="dicionario__card-descricao">{palavra.descricao}</p>

                          {/* Detalhes expandidos */}
                          {expandido && (
                            <div className="dicionario__card-detalhe">
                              {palavra.dica && (
                                <div className="dicionario__card-dica">
                                  <span className="dicionario__card-dica-titulo">Dica de leitura labial</span>
                                  {palavra.dica}
                                </div>
                              )}
                              {palavra.videoUrl ? (
                                <video
                                  className="dicionario__card-video"
                                  src={palavra.videoUrl}
                                  controls
                                  aria-label={`Vídeo demonstrativo de ${palavra.palavra}`}
                                />
                              ) : (
                                <div className="dicionario__card-video" aria-label="Vídeo demonstrativo não disponível">
                                  <Video size={18} />
                                  Vídeo demonstrativo em breve
                                </div>
                              )}
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                ))}
              </div>
            ) : (
              <div className="dicionario__vazio" role="status" aria-live="polite">
                <div className="dicionario__vazio-icone" aria-hidden="true">📖</div>
                <p className="dicionario__vazio-texto">
                  Nenhuma palavra encontrada com os filtros aplicados.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default TelaDicionario;