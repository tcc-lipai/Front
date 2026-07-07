import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import CardUsuario from "../../../components/CardUsuario";
import Botao from "../../../components/Botao";
import "./index.css";

const IconeLupa = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
);

const IconeChevron = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
  </svg>
);

// Dados mockados
const usuariosMock = [
  {
    id: 1,
    nome: "Profissional 1",
    descricao: "lorem ldwadw vlalla blal dwaddw awddwadwadwadw dwadwa",
    nivel: "Iniciante",
    status: "ativo",
    tipo: "paciente-admin",
  },
  {
    id: 2,
    nome: "Profissional 1",
    descricao: "lorem ldwadw vlalla blal dwaddw awddwadwadwadw dwadwa",
    nivel: "Iniciante",
    status: "inativo",
    tipo: "paciente-admin",
  },
  {
    id: 3,
    nome: "Profissional 1",
    descricao: "lorem ldwadw vlalla blal dwaddw awddwadwadwadw dwadwa",
    nivel: "Iniciante",
    status: "ativo",
    tipo: "paciente-admin",
  },
  {
    id: 4,
    nome: "Profissional 1",
    descricao: "lorem ldwadw vlalla blal dwaddw awddwadwadwadw dwadwa",
    nivel: "Iniciante",
    status: "inativo",
    tipo: "paciente-admin",
  },
];

// 1. Mudança do nome da função aqui:
const ProfissionaisAdmin = () => {
  const [pesquisa, setPesquisa] = useState("");
  const navigate = useNavigate();

  return (
    <div className="dashboard-admin">
      {/* Sidebar */}
      <aside className="dashboard-admin__sidebar">
        <Navbar />
      </aside>

      {/* Conteúdo principal */}
      <main className="dashboard-admin__main">
        {/* Header */}
        <header className="dashboard-admin__header">
          <h1 className="dashboard-admin__titulo">Profissionais</h1>
        </header>

        {/* Container branco */}
        <div className="dashboard-admin__container">
          {/* Barra de pesquisa e filtros */}
          <div className="dashboard-admin__controles">
            <div className="dashboard-admin__pesquisa">
              <input
                type="text"
                placeholder="Pesquise"
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
                className="dashboard-admin__input"
              />
              <span className="dashboard-admin__lupa">
                <IconeLupa />
              </span>
            </div>

            <div className="dashboard-admin__filtros">
              <button className="dashboard-admin__filtro-dropdown">
                Nível <IconeChevron />
              </button>
              <button className="dashboard-admin__filtro-dropdown">
                Consistência <IconeChevron />
              </button>
            </div>
          </div>

          {/* Lista de usuários */}
          <ul className="dashboard-admin__lista">
            {usuariosMock.map((usuario) => (
              <li key={usuario.id} className="dashboard-admin__item">
                <CardUsuario
                  tipo={usuario.tipo}
                  nome={usuario.nome}
                  descricao={usuario.descricao}
                  nivel={usuario.nivel}
                  status={usuario.status}
                  onEditar={() => alert(`Editar ${usuario.nome}`)}
                  onExcluir={() => alert(`Excluir ${usuario.nome}`)}
                />
              </li>
            ))}
          </ul>

          {/* Rodapé: Ver mais + Cadastrar */}
          <div className="dashboard-admin__rodape">
            <button className="dashboard-admin__ver-mais">
              Ver mais <IconeChevron />
            </button>
            <Botao
              texto="Cadastrar"
              onClick={() => navigate("/cadastrar-paciente")}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

// 2. Mudança na exportação aqui:
export default ProfissionaisAdmin;