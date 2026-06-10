import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Lock } from 'lucide-react';
import { useUnidades } from './index.hook';
import './index.css';

const Unidades = ({ onVoltar }) => {
  const navigate = useNavigate();
  const { unidade } = useUnidades();

  const handleVoltar = () => {
    if (onVoltar) {
      onVoltar();
    } else {
      navigate('/inicio-atividades');
    }
  };

  const handleIniciarAtividade = (atividadeId) => {
    navigate(`/atividade/alternativa/${unidade.id}?atividadeId=${atividadeId}`);
  };

  return (
    <div className="unidades">
      <div className="unidades-header">
        <button onClick={handleVoltar} className="unidades-voltar-btn">
          <ArrowLeft size={14} />
          Voltar
        </button>
        <h1 className="unidades-titulo">Unidade</h1>
        <p className="unidades-subtitulo">
          Selecione uma lição para continuar seu aprendizado de leitura labial
        </p>
      </div>

      <div className="unidades-main">
        <div className={`unidades-card ${unidade.bloqueado ? 'bloqueado' : ''}`}>
          <div className="unidades-header-content">
            <div>
              <span className="unidades-numero">Unidade {unidade.numero}</span>
              <h2 className="unidades-card-titulo">{unidade.titulo}</h2>
              <p className="unidades-card-desc">{unidade.descricao}</p>
            </div>
          </div>

          <div className="unidades-atividades-grid">
            {unidade.atividades.map((atividade) => (
              <div
                key={atividade.id}
                className={`unidades-atividade-card ${atividade.bloqueado ? 'bloqueado' : ''}`}
              >
                <span className="unidades-atividade-titulo">{atividade.titulo}</span>
                {atividade.bloqueado ? (
                  <div className="unidades-lock-icon">
                    <Lock size={14} />
                  </div>
                ) : (
                  <button
                    onClick={() => handleIniciarAtividade(atividade.id)}
                    className="unidades-atividade-btn"
                    aria-label={`Iniciar ${atividade.titulo}`}
                  >
                    <Play size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unidades;
