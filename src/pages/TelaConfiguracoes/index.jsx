import React, { useState } from 'react';
import { UserSidebar } from "../../components/UserSidebar";
import './index.css';

const TelaConfiguracoes = () => {
  // Estados para simular o ligar/desligar de cada opção
  const [modoEscuro, setModoEscuro] = useState(false);
  const [notificacoes, setNotificacoes] = useState(true);
  const [autenticacao, setAutenticacao] = useState(false);
  const [historico, setHistorico] = useState(true);
  
  // Estado para o card grande inferior (Seleção de Tema)
  const [temaSelecionado, setTemaSelecionado] = useState('claro');

  return (
    <div className="configuracoes-page-container">
      {/* Ondas decorativas de fundo - IGUAL AO PERFIL */}
      <div className="bg-waves">
        <svg viewBox="0 0 1440 1024" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M1440 0H900C1100 200 1050 500 1250 750C1350 870 1390 960 1440 1024V0Z" fill="#ecdcf7" opacity="0.6"/>
          <path d="M1440 250C1200 450 1280 700 1100 850C1000 930 920 970 850 1024H1440V250Z" fill="#f0e4fa" opacity="0.5"/>
          <path d="M1440 600C1350 720 1380 850 1200 950C1120 990 1050 1010 1000 1024H1440V600Z" fill="#e6d2f5" opacity="0.4"/>
        </svg>
      </div>

      {/* Sidebar Responsiva */}
      <UserSidebar onBackClick={() => console.log('Voltou para a Home')} />

      {/* Conteúdo Principal */}
      <main className="configuracoes-main-content">
        <h1 className="configuracoes-title">Configurações</h1>

        {/* Grade de Cards Superiores */}
        <div className="configuracoes-grid">
          
          <div className="config-card">
            <h3 className="config-card-title">Modo de Cor</h3>
            <p className="config-card-description">
              Ative o tema escuro para reduzir o cansaço visual em ambientes de baixa luminosidade.
            </p>
            <div className="config-card-action">
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={modoEscuro} 
                  onChange={(e) => setModoEscuro(e.target.checked)} 
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>

          <div className="config-card">
            <h3 className="config-card-title">Notificações</h3>
            <p className="config-card-description">
              Receba alertas e atualizações importantes sobre o seu perfil diretamente no sistema.
            </p>
            <div className="config-card-action">
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={notificacoes} 
                  onChange={(e) => setNotificacoes(e.target.checked)} 
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>

          <div className="config-card">
            <h3 className="config-card-title">Segurança</h3>
            <p className="config-card-description">
              Exigir confirmação de duas etapas em todas as alterações de dados sensíveis na conta.
            </p>
            <div className="config-card-action">
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={autenticacao} 
                  onChange={(e) => setAutenticacao(e.target.checked)} 
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>

          <div className="config-card">
            <h3 className="config-card-title">Histórico médico</h3>
            <p className="config-card-description">
              Permitir que o sistema salve um registro histórico das alterações feitas no seu diagnóstico.
            </p>
            <div className="config-card-action">
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={historico} 
                  onChange={(e) => setHistorico(e.target.checked)} 
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>

        </div>

        {/* Card Largo Inferior */}
        <div className="config-card-wide">
          <div className="wide-info">
            <h3 className="config-card-title">Tema do Sistema</h3>
            <p className="config-card-description">
              Escolha manualmente a paleta de cores predominante da interface do seu aplicativo.
            </p>
          </div>
          
          <div className="wide-actions">
            <div className="wide-toggle-row">
              <span className="toggle-label">Claro</span>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={temaSelecionado === 'claro'} 
                  onChange={() => setTemaSelecionado('claro')} 
                />
                <span className="slider round"></span>
              </label>
            </div>

            <div className="wide-toggle-row">
              <span className="toggle-label">Escuro</span>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={temaSelecionado === 'escuro'} 
                  onChange={() => setTemaSelecionado('escuro')} 
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default TelaConfiguracoes;