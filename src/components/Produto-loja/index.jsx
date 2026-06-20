import React from 'react';
import './index.css';

// Imports apenas das imagens principais
import IconGelo from '../../assets/img/iconGelo.jpg';
import IconMoedas from '../../assets/img/IconMoedas.jpg';
import IconBau from '../../assets/img/IconBau.jpg';

export default function ProdutoLoja({ title, description, price, tipo, isBlocked = false }) {
  
  // Apenas escolhe a imagem baseada no tipo, ignorando o status de bloqueio aqui
  const obterIcone = () => {
    switch (tipo) {
      case 'gelo': return IconGelo;
      case 'moedas': return IconMoedas;
      case 'bau': return IconBau;
      default: return null;
    }
  };

  const iconeAtual = obterIcone();

  return (
    <div className={`card-produto-figma ${isBlocked ? 'bloqueado' : ''}`}>
      <div className="card-conteudo-figma">
        
        {/* Lado Esquerdo: Ícone */}
        <div className="card-icone-wrapper-figma">
          {iconeAtual ? (
            <img src={iconeAtual} alt={title} className="card-icone-figma" />
          ) : (
            <div className="card-icone-placeholder-figma" />
          )}
        </div>

        {/* Lado Direito: Textos e Botão */}
        <div className="card-info-figma">
          <div className="card-textos-figma">
            <h3 className="card-titulo-figma">{title}</h3>
            <p className="card-descricao-figma">{description}</p>
          </div>
          
          <div className="card-preco-wrapper-figma">
            <div className="card-botao-preco-figma">
              <span className="preco-texto-figma">{price}</span>
              <span className="preco-estrela-figma">⭐</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}