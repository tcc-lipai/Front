import { useState } from "react";
import "./index.css";

export default function Filtro({ busca, setBusca }) {
  const [abertoMobile, setAbertoMobile] = useState(false);

  return (
    <>
      <button className="btn-filtro-flutuante" onClick={() => setAbertoMobile(true)}>
        ☰ Filtros
      </button>

      {abertoMobile && <div className="filter-overlay" onClick={() => setAbertoMobile(false)} />}

      <aside className={`filter ${abertoMobile ? "open" : ""}`}>
        <div className="filter-header">
          <h2>Filtro</h2>
          <button className="btn-fechar-filtro" onClick={() => setAbertoMobile(false)}>
            ✕
          </button>
        </div>

        <div className="search">
          <input
            type="text"
            placeholder="Pesquisar unidade"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
          />
        </div>
      </aside>
    </>
  );
}
