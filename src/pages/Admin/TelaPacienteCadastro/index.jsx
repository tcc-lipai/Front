import React, { useState } from "react";
import Navbar from "../../../components/Navbar_reta";
import Botao from "../../../components/Botao";
import "./index.css";

const CadastrarPaciente = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    nivelDificuldade: "",
    tipoUsuario: "",
    codigoProfissional: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados enviados:", formData);
  };

  return (
    <div className="cadastro-page-container">
      <Navbar />

      <main className="cadastro-main-content">
        <div className="cadastro-card">
          <div className="cadastro-header">
            <h1 className="cadastro-title">Cadastrar Paciente</h1>
          </div>

          <form onSubmit={handleSubmit} className="cadastro-form">
            <div className="form-group">
              <label htmlFor="nome">Nome:</label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="senha">Senha:</label>
              <input
                type="password"
                id="senha"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <select
                id="nivelDificuldade"
                name="nivelDificuldade"
                value={formData.nivelDificuldade}
                onChange={handleChange}
                required
              >
                <option value="" disabled hidden>
                  Nível dificuldade
                </option>
                <option value="facil">Fácil</option>
                <option value="medio">Médio</option>
                <option value="dificil">Difícil</option>
              </select>
            </div>

            <div className="form-group">
              <select
                id="tipoUsuario"
                name="tipoUsuario"
                value={formData.tipoUsuario}
                onChange={handleChange}
                required
              >
                <option value="" disabled hidden>
                  Tipo usuario
                </option>
                <option value="paciente">Paciente</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div className="form-group input-opcional">
              <label htmlFor="codigoProfissional">Código do profissional:</label>
              <input
                type="text"
                id="codigoProfissional"
                name="codigoProfissional"
                value={formData.codigoProfissional}
                onChange={handleChange}
              />
              <span className="label-opcional">*Opcional</span>
            </div>

            <div className="container-botao-enviar">
              <Botao
                texto="Cadastrar"
                corDeFundo="#7A3B8C"
                corTexto="#FFFFFF"
                className="btn-cadastro-submit"
              />
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CadastrarPaciente;