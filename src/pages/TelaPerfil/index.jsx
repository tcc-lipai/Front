import React, { useState } from 'react';
import { UserSidebar } from "../../components/UserSidebar";
import './index.css';


const TelaPerfil = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [diagnostico, setDiagnostico] = useState('');


  const handleSalvar = (e) => {
    e.preventDefault();
    console.log('Dados salvos:', { nome, email, senha, diagnostico });
  };


  return (
    <div className="perfil-page-container">
      <div className="bg-waves">
        <svg viewBox="0 0 1440 1024" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M1440 0H900C1100 200 1050 500 1250 750C1350 870 1390 960 1440 1024V0Z" fill="#ecdcf7" opacity="0.6"/>
          <path d="M1440 250C1200 450 1280 700 1100 850C1000 930 920 970 850 1024H1440V250Z" fill="#f0e4fa" opacity="0.5"/>
          <path d="M1440 600C1350 720 1380 850 1200 950C1120 990 1050 1010 1000 1024H1440V600Z" fill="#e6d2f5" opacity="0.4"/>
        </svg>
      </div>


      <UserSidebar onBackClick={() => console.log('Voltou para a Home')} />


      <main className="perfil-main-content">
       
        <div className="perfil-header">
          <h1 className="perfil-title">Seu Perfil</h1>
         
          <div className="progress-container">
            <svg className="progress-svg" viewBox="0 0 90 90">
              <circle className="progress-circle-bg" cx="45" cy="45" r="40" />
              <circle className="progress-circle-bar" cx="45" cy="45" r="40" />
            </svg>
            <div className="progress-text">
              <strong>75%</strong>
              <br />
              <span>Completo</span>
            </div>
          </div>
        </div>


        <form className="perfil-form" onSubmit={handleSalvar}>
         
          <div className="form-group">
            <label>Nome:</label>
            <span>Altere seu nome completo cadastrado na conta</span>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>


          <div className="form-group">
            <label>Email:</label>
            <span>Gerencie seu endereço de email principal de acesso</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>


          <div className="form-group">
            <label>Senha:</label>
            <span>Altere sua chave de segurança secreta</span>
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>


          <div className="form-group">
            <label>Diagnóstico:</label>
            <span>Insira ou edite os dados do seu diagnóstico médico atual</span>
            <input
              type="text"
              value={diagnostico}
              onChange={(e) => setDiagnostico(e.target.value)}
            />
          </div>


          <button type="submit" className="btn-confirmar">
            Confirmar
          </button>


        </form>
      </main>
    </div>
  );
};


export default TelaPerfil;
