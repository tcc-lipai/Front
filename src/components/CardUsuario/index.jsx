import React from 'react';
import Botao from '../Botao';
import './index.css';

const CardUsuario = ({
  tipo = 'paciente-admin',
  nome = '',
  descricao = '',
  nivel = '',
  status = 'ativo',
  onEditar = () => {},
  onExcluir = () => {},
  onVer = () => {},
}) => {
  const isAtivo = status === 'ativo';

  const renderBotoes = () => {
    if (tipo === 'paciente-profissional') {
      return (
        <div className="card-usuario__acoes">
          <Botao texto="Ver" variante="primario" onClick={onVer} />
        </div>
      );
    }

    return (
      <div className="card-usuario__acoes">
        <Botao texto="Editar" variante="primario" onClick={onEditar} />
        <Botao texto="Excluir" variante="perigo" onClick={onExcluir} />
      </div>
    );
  };

  const renderBadges = () => {
    if (tipo === 'profissional') return null;

    return (
      <div className="card-usuario__badges">
        {nivel && (
          <span className="card-usuario__badge card-usuario__badge--nivel">
            {nivel}
          </span>
        )}
        <span
          className={`card-usuario__badge ${
            isAtivo
              ? 'card-usuario__badge--ativo'
              : 'card-usuario__badge--inativo'
          }`}
        >
          {isAtivo ? 'Ativo' : 'Não Ativo'}
        </span>
      </div>
    );
  };

  return (
    <div className="card-usuario">
      <div className="card-usuario__avatar">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          width="32"
          height="32"
        >
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
        </svg>
      </div>

      <div className="card-usuario__info">
        <h3 className="card-usuario__nome">{nome}</h3>
        <p className="card-usuario__descricao">{descricao}</p>
        {renderBadges()}
      </div>

      {renderBotoes()}
    </div>
  );
};

export default CardUsuario;