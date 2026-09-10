import { useState } from "react";
import "./index.css";
import { DIFICULDADES, STATUS } from "./index.types";

export default function Filtro({
  busca,
  setBusca,
  dificuldade,
  setDificuldade,
  status,
  setStatus,
  alternarItem,
}) {
  const [abertoMobile, setAbertoMobile] = useState(false);
  const [abertoDificuldade, setAbertoDificuldade] = useState(true);
  const [abertoStatus, setAbertoStatus] = useState(true);

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
            placeholder="Pesquisar"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
          />
        </div>

        <div className="section">
          <button
            className="section-title"
            onClick={() => setAbertoDificuldade((estado) => !estado)}
          >
            <span>Dificuldade</span>
            <span>{abertoDificuldade ? "⌃" : "⌄"}</span>
          </button>

          {abertoDificuldade && (
            <div className="options">
              {DIFICULDADES.map((item) => (
                <label key={item}>
                  <input
                    type="checkbox"
                    checked={dificuldade.includes(item)}
                    onChange={() => alternarItem(item, dificuldade, setDificuldade)}
                  />
                  {item}
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="section">
          <button className="section-title" onClick={() => setAbertoStatus((estado) => !estado)}>
            <span>Status</span>
            <span>{abertoStatus ? "⌃" : "⌄"}</span>
          </button>

          {abertoStatus && (
            <div className="options">
              {STATUS.map((item) => (
                <label key={item}>
                  <input
                    type="checkbox"
                    checked={status.includes(item)}
                    onChange={() => alternarItem(item, status, setStatus)}
                  />
                  {item}
                </label>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
