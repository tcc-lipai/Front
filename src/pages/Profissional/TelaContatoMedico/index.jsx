import React, { useState } from "react";
import Navbar, { NAV_ITENS_PROFISSIONAL } from "../../../components/Navbar";
import Botao from "../../../components/Botao";
import { enviarMensagemContato } from "../../../services/contatoService";

import "./index.css";

const TelaContatoMedico = () => {
  const [formData, setFormData] = useState({
    nome: localStorage.getItem("nome") || "",
    email: localStorage.getItem("email") || "",
    mensagem: "",
  });
  const [enviando, setEnviando] = useState(false);
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setEnviando(true);

    const resultado = await enviarMensagemContato(formData.mensagem);
    setEnviando(false);

    if (resultado.sucesso) {
      setStatus("Mensagem enviada com sucesso!");
      setFormData((atual) => ({ ...atual, mensagem: "" }));
    } else {
      setStatus(resultado.mensagem);
    }
  };

  return (
    <div className="page-layout">
      <Navbar itens={NAV_ITENS_PROFISSIONAL} />

      <main className="content-container">
        <div className="card-contato">
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
                  placeholder="Como podemos te chamar?"
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
                  placeholder="seu@email.com"
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
                  placeholder="Conte pra gente o que aconteceu..."
                  value={formData.mensagem}
                  onChange={handleChange}
                  required
                />
              </div>

              {status && (
                <p role="status" className="form-subtitle">
                  {status}
                </p>
              )}

              <Botao
                type="submit"
                texto={enviando ? "Enviando..." : "Enviar"}
                disabled={enviando}
                corDeFundo="#7b3b93"
                corTexto="#ffffff"
                className="btn-enviar"
              />
            </form>
          </div>

          <div className="illustration-section">
            <div className="panel-content">
              <div className="panel-icon">💬</div>
              <h2 className="panel-title">Estamos aqui pra ajudar</h2>
              <p className="panel-text">
                Nossa equipe responde o mais rápido possível. Fica à vontade pra entrar em contato!
              </p>
            </div>

            <div className="social-media-links">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="social-icon"
              >
                i
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="social-icon"
              >
                f
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TelaContatoMedico;
