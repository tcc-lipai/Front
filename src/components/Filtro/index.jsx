// src/components/Filtro/index.jsx
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFiltro } from './index.hook';
import './index.css';

const DIFICULDADES = [
  { chave: 'iniciante', label: 'Iniciante', badge: 'iniciante' },
  { chave: 'intermediario', label: 'Intermediário', badge: 'intermediario' },
  { chave: 'avancado', label: 'Avançado', badge: 'avancado' },
];

const STATUS_OPCOES = [
  { chave: 'concluido', label: 'Concluído' },
  { chave: 'emAndamento', label: 'Em andamento' },
  { chave: 'realizado', label: 'Realizado' },
];

/**
 * Sidebar de filtro reutilizável.
 * @param {import('./index.types').FiltroProps} props
 */
const Filtro = ({ onFiltroChange, valorInicial }) => {
  const {
    filtro,
    aberto,
    temFiltroAtivo,
    handleBusca,
    handleCheckbox,
    handleLimpar,
    toggleAberto,
  } = useFiltro(onFiltroChange, valorInicial);

  return (
    <aside
      className={`filtro${aberto ? '' : ' filtro--fechado'}`}
      aria-label="Painel de filtros"
      role="search"
    >
      {/* Cabeçalho */}
      <div className="filtro__header">
        {aberto && (
          <span className="filtro__titulo" aria-hidden="true">
            <SlidersHorizontal size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
            Filtros
          </span>
        )}
        <button
          className="filtro__toggle"
          onClick={toggleAberto}
          aria-label={aberto ? 'Fechar painel de filtros' : 'Abrir painel de filtros'}
          aria-expanded={aberto}
        >
          {aberto ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {aberto && (
        <>
          {/* Busca */}
          <div className="filtro__busca-wrapper">
            <span className="filtro__busca-icone" aria-hidden="true">
              <Search size={14} />
            </span>
            <input
              className="filtro__busca"
              type="search"
              placeholder="Buscar atividade..."
              value={filtro.busca}
              onChange={(e) => handleBusca(e.target.value)}
              aria-label="Buscar atividade por nome"
            />
          </div>

          <hr className="filtro__divisor" />

          {/* Dificuldade */}
          <section className="filtro__secao" aria-labelledby="filtro-dificuldade-titulo">
            <p className="filtro__secao-titulo" id="filtro-dificuldade-titulo">
              Dificuldade
            </p>
            {DIFICULDADES.map(({ chave, label, badge }) => (
              <label key={chave} className="filtro__item">
                <input
                  className="filtro__checkbox"
                  type="checkbox"
                  checked={filtro.dificuldade[chave]}
                  onChange={() => handleCheckbox('dificuldade', chave)}
                  aria-label={`Filtrar por dificuldade: ${label}`}
                />
                <span className="filtro__label">{label}</span>
                <span className={`filtro__badge filtro__badge--${badge}`} aria-hidden="true">
                  {label.charAt(0)}
                </span>
              </label>
            ))}
          </section>

          <hr className="filtro__divisor" />

          {/* Status */}
          <section className="filtro__secao" aria-labelledby="filtro-status-titulo">
            <p className="filtro__secao-titulo" id="filtro-status-titulo">
              Status
            </p>
            {STATUS_OPCOES.map(({ chave, label }) => (
              <label key={chave} className="filtro__item">
                <input
                  className="filtro__checkbox"
                  type="checkbox"
                  checked={filtro.status[chave]}
                  onChange={() => handleCheckbox('status', chave)}
                  aria-label={`Filtrar por status: ${label}`}
                />
                <span className="filtro__label">{label}</span>
              </label>
            ))}
          </section>

          {/* Limpar filtros */}
          {temFiltroAtivo && (
            <>
              <hr className="filtro__divisor" />
              <button
                className="filtro__limpar"
                onClick={handleLimpar}
                aria-label="Limpar todos os filtros"
              >
                Limpar filtros
              </button>
            </>
          )}
        </>
      )}
    </aside>
  );
};

export default Filtro;
