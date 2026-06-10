import React from 'react';
import { Search } from 'lucide-react';
import { useFiltro } from './index.hook';
import { DIFICULDADES, STATUS } from './index.types';
import './index.css';

const Filtro = ({ onFiltroChange }) => {
  const {
    busca,
    setBusca,
    dificuldades,
    toggleDificuldade,
    status,
    toggleStatus,
    limparFiltros,
    temFiltroAtivo,
  } = useFiltro();

  const handleBuscaChange = (e) => {
    const novoValor = e.target.value;
    setBusca(novoValor);
    if (onFiltroChange) {
      onFiltroChange({ busca: novoValor, dificuldades, status });
    }
  };

  const handleToggleDificuldade = (dif) => {
    toggleDificuldade(dif);
    if (onFiltroChange) {
      onFiltroChange({
        busca,
        dificuldades: { ...dificuldades, [dif]: !dificuldades[dif] },
        status,
      });
    }
  };

  const handleToggleStatus = (st) => {
    toggleStatus(st);
    if (onFiltroChange) {
      onFiltroChange({
        busca,
        dificuldades,
        status: { ...status, [st]: !status[st] },
      });
    }
  };

  const handleLimpar = () => {
    limparFiltros();
    if (onFiltroChange) {
      onFiltroChange({ busca: '', dificuldades: {}, status: {} });
    }
  };

  return (
    <aside className="filtro-sidebar">
      {/* Busca */}
      <div className="filtro-secao">
        <h3 className="filtro-titulo">Buscar</h3>
        <div className="filtro-busca-wrapper">
          <Search size={16} className="filtro-busca-icon" />
          <input
            type="text"
            placeholder="Buscar..."
            value={busca}
            onChange={handleBuscaChange}
            className="filtro-busca-input"
            aria-label="Buscar atividades"
          />
        </div>
      </div>

      {/* Dificuldade */}
      <div className="filtro-secao">
        <h3 className="filtro-titulo">Dificuldade</h3>
        <div className="filtro-checkbox-grupo">
          {DIFICULDADES.map((dif) => (
            <label key={dif.id} className="filtro-checkbox-item">
              <input
                type="checkbox"
                checked={dificuldades[dif.id] || false}
                onChange={() => handleToggleDificuldade(dif.id)}
                className="filtro-checkbox-input"
                aria-label={`Filtrar por ${dif.label}`}
              />
              <span className="filtro-checkbox-label">{dif.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="filtro-secao">
        <h3 className="filtro-titulo">Status</h3>
        <div className="filtro-checkbox-grupo">
          {STATUS.map((st) => (
            <label key={st.id} className="filtro-checkbox-item">
              <input
                type="checkbox"
                checked={status[st.id] || false}
                onChange={() => handleToggleStatus(st.id)}
                className="filtro-checkbox-input"
                aria-label={`Filtrar por ${st.label}`}
              />
              <span className="filtro-checkbox-label">{st.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Limpar Filtros */}
      {temFiltroAtivo && (
        <>
          <div className="filtro-divisor" />
          <button
            onClick={handleLimpar}
            className="filtro-botao-limpar"
            aria-label="Limpar todos os filtros"
          >
            Limpar filtros
          </button>
        </>
      )}
    </aside>
  );
};

export default Filtro;
