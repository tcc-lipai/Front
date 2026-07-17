import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import Navbar from "../../../components/Navbar_reta";
import BarrasDeDesempenho from "../../../components/BarrasDeDesempenho";
import InfoAtividades from "../../../components/InfoAtividades/InfoAtividades";
import "./index.css";

const TelaPaciente = () => {
  const navigate = useNavigate(); 

  const [dadosDesempenho] = useState([
    { label: "Interpretação", acertos: 7.5, total: 10 },
    { label: "Fala", acertos: 9, total: 10 },
    { label: "Video", acertos: 9, total: 10 }
  ]);

  const [busca, setBusca] = useState("");

  return (
    <div className="paciente-page-container">
      <Navbar />

      <main className="paciente-main-content">
        <div className="paciente-card-background">
          
          <section className="paciente-perfil-header">
            <div className="paciente-avatar-container">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="paciente-avatar-icon">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="#7A3A8E"/>
              </svg>
            </div>

            <div className="paciente-info-texto">
              <h1 className="paciente-nome">Paciente 1</h1>
              
              <div className="paciente-tags-container">
                <span className="tag-status tag-iniciante">Iniciante</span>
                <span className="tag-status tag-ativo">Ativo</span>
              </div>

              <p className="paciente-descricao">
                Aqui vai a descrição de como vai ser a atividade e o que será cobrado
              </p>
            </div>
          </section>

          <section className="paciente-desempenho-section">
            <h2 className="secao-titulo-sub">Desempenho Geral</h2>
            <div className="container-barras-wrapper">
              <BarrasDeDesempenho dados={dadosDesempenho} />
            </div>
          </section>

          <section className="paciente-busca-section">
            <div className="busca-input-wrapper">
              <input 
                type="text" 
                placeholder="Buscar atividade" 
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="input-busca-paciente"
              />
              <svg className="busca-lupa-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7A3A8E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </section>

          <section className="paciente-atividades-lista">
            <InfoAtividades 
              titulo="Primeira Atividade"
              progresso={75}
              onAvancar={() => navigate("/paciente/atividade/1")} 
            />
            <InfoAtividades 
              titulo="Segunda Atividade"
              progresso={40}
              onAvancar={() => navigate("/paciente/atividade/2")} 
            />
          </section>

        </div>
      </main>
    </div>
  );
};

export default TelaPaciente;