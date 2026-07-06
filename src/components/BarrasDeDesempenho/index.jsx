import React from 'react';
import './index.css';

const BarrasDeDesempenho = ({ dados = [], className = '' }) => {

  if (!dados || dados.length === 0) {
    return <p className="barras-empty-state">Nenhum dado de desempenho disponível.</p>;
  }

  // Mapeamento das cores exatas enviadas do Figma com base na categoria
  const obterCoresPorLabel = (label) => {
    const nomeLimpo = label.toLowerCase().trim();

    if (nomeLimpo.includes('interpretação') || nomeLimpo.includes('interpretacao')) {
      return { preenchimento: '#F0BFFF', texto: '#7A3A8E' }; // Lilás claro do Figma
    }
    if (nomeLimpo.includes('fala')) {
      return { preenchimento: '#B78CC4', texto: '#7A3A8E' }; // Roxo intermediário do Figma
    }
    if (nomeLimpo.includes('video') || nomeLimpo.includes('vídeo')) {
      return { preenchimento: '#705578', texto: '#462057' }; // Roxo escuro cinzento do Figma
    }

    // Cor padrão caso venha outro nome de categoria no futuro
    return { preenchimento: '#7A3A8E', texto: '#462057' };
  };

  return (
    <div className={`barras-desempenho-container ${className}`}>
      {dados.map((barra, index) => {
        const { label = '', acertos = 0, total = 0 } = barra;
        
        // Cálculo matemático da porcentagem e largura física
        const porcentagem = total > 0 ? Math.round((acertos / total) * 100) : 0;
        const larguraCss = `${Math.min(porcentagem, 100)}%`;

        // Busca as cores exclusivas para essa categoria
        const cores = obterCoresPorLabel(label);

        return (
          <div key={index} className="barra-item-linha">
            
            {/* Esquerda: Bolinha Indicadora + Nome da Categoria */}
            <div className="barra-lado-esquerdo">
              <span 
                className="barra-status-dot" 
                style={{ backgroundColor: cores.preenchimento }}
              ></span>
              <span className="barra-label" style={{ color: cores.texto }}>
                {label}
              </span>
            </div>

            {/* Direita: O trilho com o progresso físico de cada cor */}
            <div className="barra-trilho-fundo">
              <div 
                className="barra-preenchimento" 
                style={{ 
                  width: larguraCss,
                  backgroundColor: cores.preenchimento 
                }}
              ></div>
            </div>

          </div>
        );
      })}
    </div>
  );
};

export default BarrasDeDesempenho;