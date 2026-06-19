import React from 'react';
import './index.css';
import Botao from '../../components/Botao';
import { X } from 'lucide-react';

const TelaAtividadeVideo = () => {
  return (
    <div className="atividade-overlay">
      <div className="atividade-container">

        <div className="atividade-header">
          <div className="atividade-titulo">
            <h1>Primeira Atividade</h1>
            <span>Unidade 1</span>
          </div>

          <div className="atividade-progresso">
            <div className="barra-progresso">
              <div className="progresso"></div>
            </div>
          </div>

          <button className="btn-fechar">
            <X size={38} />
          </button>
        </div>

        {/* Aqui depois entra o vídeo vindo do back */}
        <div className="video-container">
          <div className="video-placeholder">
            <span>VIDEO AULA</span>
          </div>
        </div>

        <div className="atividade-conteudo">
          <span className="video-numero">Vídeo 1</span>

          <h2>Título do vídeo</h2>

          <p>
            Aqui vai a descrição da vídeo aula e um mini resumo do que será
            ensinado e sua importância lorem fesfes fafw frfs f e3afa fwaf
            fffffffff adwad f wa fwafo hdhwhdw
          </p>

          <p>
            Aqui vai a descrição da vídeo aula e um mini resumo do que será
            ensinado e sua importância lorem fesfes fafw frfs f e3afa fwaf
            fffffffff adwad f wa fwafo hdhwhdw
          </p>
        </div>

        <div className="atividade-botao">
          <Botao
            texto="Finalizar"
            corDeFundo="#9065A6"
            corTexto="#FFFFFF"
            onClick={() => console.log('Finalizar')}
          />
        </div>

      </div>
    </div>
  );
};

export default TelaAtividadeVideo;