import React from 'react';
import './index.css';

export default function ProdutoLoja({ title, description, price, icon, isBlocked = false }) {
  return (
    <div className={`card-produto ${isBlocked ? 'bloqueado' : ''}`}>
      {/* Container da esquerda: Ícone e Infos */}
      <div className="card-conteudo">
        <div className="card-icone-wrapper">
          {icon ? (
            <img src={icon} alt={title} className="card-icone" />
          ) : (
            <div className="card-icone-placeholder" />
          )}
        </div>

        <div className="card-textos">
          <h3 className="card-titulo">{title}</h3>
          <p className="card-descricao">{description}</p>
        </div>
      </div>

      {/* Container da direita: Botão de Preço */}
      <div className="card-preco-wrapper">
        <button className="card-botao-preco" disabled={isBlocked}>
          <span className="preco-texto">{price}</span>
          <span className="preco-estrela">⭐</span>
        </button>
      </div>
    </div>
  );
}