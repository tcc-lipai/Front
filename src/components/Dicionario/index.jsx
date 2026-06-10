import React from 'react';
import { Search, ChevronDown, ChevronUp, Star } from 'lucide-react';
import { useDicionario } from './index.hook';
import './index.css';

const Dicionario = () => {
  const {
    busca,
    setBusca,
    letraAtiva,
    setLetraAtiva,
    categoriaAtiva,
    setCategoriaAtiva,
    favoritos,
    toggleFavorito,
    expandido,
    toggleExpandido,
    limparFiltros,
    palavrasFiltradas,
    grupos,
    letrasComPalavra,
    CATEGORIAS,
    LETRAS,
  } = useDicionario();

  return (
    <div className="dicionario">
      <div className="dicionario-header">
        <div className="dicionario-header-content">
          <h1 className="dicionario-titulo">Dicionário</h1>
          <p className="dicionario-subtitulo">
            Consulte palavras e expressões com dicas de leitura labial
          </p>
        </div>

        <div className="dicionario-busca-wrapper">
          <Search size={16} className="dicionario-busca-icon" />
          <input
            type="text"
            placeholder="Buscar palavra..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="dicionario-busca-input"
          />
        </div>
      </div>

      <div className="dicionario-corpo">
        <aside className="dicionario-alfabeto">
          {LETRAS.map((letra) => (
            <button
              key={letra}
              onClick={() => setLetraAtiva(letraAtiva === letra ? '' : letra)}
              className={`dicionario-letra-btn ${letraAtiva === letra ? 'ativa' : ''}`}
              disabled={!letrasComPalavra.includes(letra)}
            >
              {letra}
            </button>
          ))}
        </aside>

        <section className="dicionario-main">
          <div className="dicionario-categorias">
            {CATEGORIAS.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoriaAtiva(categoriaAtiva === cat ? '' : cat)}
                className={`dicionario-categoria-btn ${categoriaAtiva === cat ? 'ativa' : ''}`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div className="dicionario-info-bar">
            <span className="mdicionario-contagem">
              {palavrasFiltradas.length} {palavrasFiltradas.length === 1 ? 'palavra' : 'palavras'}
            </span>
            {(busca || letraAtiva || categoriaAtiva) && (
              <button onClick={limparFiltros} className="dicionario-limpar-btn">
                Limpar filtros
              </button>
            )}
          </div>

          {letrasComPalavra.length > 0 ? (
            <div className="dicionario-lista">
              {letrasComPalavra.map((letra) => (
                <div key={letra} className="dicionario-grupo">
                  <h2 className="dicionario-grupo-letra">{letra}</h2>
                  {grupos[letra].map((palavra) => (
                    <div
                      key={palavra.id}
                      className={`dicionario-card ${expandido === palavra.id ? 'expandido' : ''}`}
                    >
                      <div
                        className="dicionario-card-topo"
                        onClick={() => toggleExpandido(palavra.id)}
                      >
                        <span className="dicionario-card-palavra">{palavra.palavra}</span>
                        <div className="dicionario-card-acoes">
                          <span className="dicionario-card-categoria">
                            {palavra.categoria.charAt(0).toUpperCase() + palavra.categoria.slice(1)}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorito(palavra.id);
                            }}
                            className={`dicionario-card-favorito ${
                              favoritos[palavra.id] ? 'ativo' : ''
                            }`}
                          >
                            <Star
                              size={15}
                              fill={favoritos[palavra.id] ? 'currentColor' : 'none'}
                            />
                          </button>
                          <span className="dicionario-card-expandir">
                            {expandido === palavra.id ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            )}
                          </span>
                        </div>
                      </div>

                      <p className="dicionario-card-descricao">{palavra.descricao}</p>

                      {expandido === palavra.id && (
                        <div className="dicionario-card-detalhe">
                          <div className="dicionario-card-dica">
                            <span className="dicionario-card-dica-titulo">
                              Dica de leitura labial
                            </span>
                            {palavra.dica}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="dicionario-vazio">
              <p>Nenhuma palavra encontrada com os filtros selecionados.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dicionario;
