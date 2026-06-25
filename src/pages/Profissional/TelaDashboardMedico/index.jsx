import React, { useState } from "react";
import Navbar from "../../../components/Navbar"
import { HeaderActions } from "../../../components/infoEstrelas";
import CardUsuario from "../../../components/CardUsuario";
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

const IconeX = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
);

// Dados mockados
const pacientesMock = [
  {
    id: 1,
    nome: "Paciente 1",
    descricao: "lorem ldwadw vlalla blal  dwaddw  awddwadwadwadw dwadwa",
    nivel: "Iniciante",
    status: "ativo",
    tipo: "paciente-profissional",
    botao: "Começar",
  },
  {
    id: 2,
    nome: "Paciente 1",
    descricao: "lorem ldwadw vlalla blal  dwaddw  awddwadwadwadw dwadwa",
    nivel: "Iniciante",
    status: "inativo",
    tipo: "paciente-profissional",
    botao: "Começar",
  },
  {
    id: 3,
    nome: "Paciente 1",
    descricao: "lorem ldwadw vlalla blal  dwaddw  awddwadwadwadw dwadwa",
    nivel: "Iniciante",
    status: "inativo",
    tipo: "paciente-profissional",
    botao: "Começar",
  },
  {
    id: 4,
    nome: "Paciente 1",
    descricao: "lorem ldwadw vlalla blal  dwaddw  awddwadwadwadw dwadwa",
    nivel: "Iniciante",
    status: "inativo",
    tipo: "paciente-profissional",
    botao: "Ver",
  },
];

const DashboardMedico = () => {
  const [pesquisa, setPesquisa] = useState("");
  const [filtroNivel, setFiltroNivel] = useState(true);
  const [filtroConsistencia, setFiltroConsistencia] = useState(true);

  return (
    <div className="dashboard-medico">
      {/* Sidebar: isola a Navbar para que ela nunca sobreponha o conteúdo */}
      <aside className="dashboard-medico__sidebar">
        <Navbar />
      </aside>

      {/* Conteúdo principal */}
      <main className="dashboard-medico__main">
        {/* Header */}
        <header className="dashboard-medico__header">
          <h1 className="dashboard-medico__titulo">Pacientes</h1>
          <HeaderActions onOpenProfile={() => {}} />
        </header>

        {/* Container branco com lista */}
        <div className="dashboard-medico__container">
          {/* Barra de pesquisa e filtros */}
          <div className="dashboard-medico__controles">
            <div className="dashboard-medico__pesquisa">
              <input
                type="text"
                placeholder="Pesquise"
                value={pesquisa}
                onChange={(e) => setPesquisa(e.target.value)}
                className="dashboard-medico__input"
              />
              <span className="dashboard-medico__lupa">
                <IconeLupa />
              </span>
            </div>

            <div className="dashboard-medico__filtros">
              <button className="dashboard-medico__filtro-dropdown">
                Nível <IconeChevron />
              </button>
              <button className="dashboard-medico__filtro-dropdown">
                Consistência <IconeChevron />
              </button>
            </div>
          </div>

          {/* Lista de pacientes */}
          <ul className="dashboard-medico__lista">
            {pacientesMock.map((paciente) => (
              <li key={paciente.id} className="dashboard-medico__item">
                <CardUsuario
                  tipo={paciente.tipo}
                  nome={paciente.nome}
                  descricao={paciente.descricao}
                  nivel={paciente.nivel}
                  status={paciente.status}
                  onVer={() => alert(`Ver ${paciente.nome}`)}
                />
              </li>
            ))}
          </ul>

          {/* Ver mais */}
          <button className="dashboard-medico__ver-mais">
            Ver mais <IconeChevron />
          </button>
        </div>
      </main>
    </div>
  );
};

export default DashboardMedico;
