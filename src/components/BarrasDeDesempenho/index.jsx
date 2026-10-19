import React from "react";
import "./index.css";

const BarrasDeDesempenho = ({ dados = [], className = "" }) => {
  if (!dados || dados.length === 0) {
    return <p className="barras-empty-state">Nenhum dado de desempenho disponível.</p>;
  }

  // só a cor do preenchimento/bolinha muda por tipo — o texto usa a cor
  // padrão do tema (--lipai-text) pra ficar legível tanto no claro quanto
  // no escuro.
  const obterCorPorLabel = (label) => {
    const nomeLimpo = label.toLowerCase().trim();

    if (nomeLimpo.includes("interpretação") || nomeLimpo.includes("interpretacao")) {
      return "#F0BFFF";
    }
    if (nomeLimpo.includes("fala")) {
      return "#B78CC4";
    }
    if (nomeLimpo.includes("video") || nomeLimpo.includes("vídeo")) {
      return "#8A6E92";
    }

    return "#8A3FA0";
  };

  return (
    <div className={`barras-desempenho-container ${className}`}>
      {dados.map((barra, index) => {
        const { label = "", acertos = 0, total = 0 } = barra;

        const porcentagem = total > 0 ? Math.round((acertos / total) * 100) : 0;
        const larguraCss = `${Math.min(porcentagem, 100)}%`;

        const cor = obterCorPorLabel(label);

        return (
          <div key={index} className="barra-item-linha">
            <div className="barra-lado-esquerdo">
              <span className="barra-status-dot" style={{ backgroundColor: cor }}></span>
              <span className="barra-label" title={label}>
                {label}
              </span>
            </div>

            <div className="barra-trilho-fundo">
              <div
                className="barra-preenchimento"
                style={{
                  width: larguraCss,
                  backgroundColor: cor,
                }}
              ></div>
            </div>

            <span className="barra-porcentagem">{porcentagem}%</span>
          </div>
        );
      })}
    </div>
  );
};

export default BarrasDeDesempenho;
