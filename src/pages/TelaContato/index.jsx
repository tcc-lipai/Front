import React, { useState } from 'react';
import Navbar from '../../components/Navbar'; // Importação da sua Navbar lateral
import './index.css';


// Importando a imagem local direto da sua pasta de assets
import biaImg from '../../assets/img/biaComputador.png';


const TelaContato = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    mensagem: ''
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Dados do formulário:', formData);
  };


  return (
    <div className="page-layout">
      {/* Sua Navbar na lateral */}
      <Navbar />


      <main className="content-container">
        <div className="card-contato">
         
          {/* Lado Esquerdo - Formulário */}
          <div className="form-section">
            <h1 className="form-title">Está com Problemas?</h1>
            <p className="form-subtitle">
              Ajude-nos a melhorar sua experiência relatando erros ou enviando dúvidas.
            </p>


            <form onSubmit={handleSubmit} className="contact-form">
              <div className="input-group">
                <label htmlFor="nome">Nome</label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
              </div>


              <div className="input-group">
                <label htmlFor="email">E-mail</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>


              <div className="input-group">
                <label htmlFor="mensagem">Sua Mensagem</label>
                <textarea
                  id="mensagem"
                  name="mensagem"
                  rows="5"
                  value={formData.mensagem}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>


              <button type="submit" className="btn-enviar">
                Enviar
              </button>
            </form>
          </div>


          {/* Lado Direito - Ilustração Local e Redes Sociais */}
          <div className="illustration-section">
            <div className="avatar-wrapper">
              <img
                src={biaImg}
                alt="Ilustração da Bia no Computador"
                className="avatar-img"
              />
            </div>
           
            <div className="social-media-links">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon">
                i
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon">
                f
              </a>
            </div>
          </div>


        </div>
      </main>
    </div>
  );
};


export default TelaContato;
