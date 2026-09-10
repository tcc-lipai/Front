import React, { useState } from "react";
import { HeaderActions } from "../../../components/infoEstrelas";
import NavbarProfissional from "../../../components/NavbarProfissional";
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

const pacientesMock = [
  {
    id: 1,
    nome: "Paciente 1",
    descricao: "lorem...",
    nivel: "Iniciante",
    status: "ativo",
    tipo: "paciente-profissional",
    botao: "Começar",
  },
  {
    id: 2,
    nome: "Paciente 2",
    descricao: "lorem...",
    nivel: "Intermediário",
    status: "inativo",
    tipo: "paciente-profissional",
    botao: "Começar",
  },
  {
    id: 3,
    nome: "Paciente 3",
    descricao: "lorem...",
    nivel: "Iniciante",
    status: "inativo",
    tipo: "paciente-profissional",
    botao: "Começar",
  },
  {
    id: 4,
    nome: "Paciente 4",
    descricao: "lorem...",
    nivel: "Avançado",
    status: "inativo",
    tipo: "paciente-profissional",
    botao: "Ver",
  },
];

const DashboardMedico = () => {
  const [pesquisa, setPesquisa] = useState("");

  // Estados para menus e filtros
  const [menuNivelAberto, setMenuNivelAberto] = useState(false);
  const [menuConsistenciaAberto, setMenuConsistenciaAberto] = useState(false);
  const [nivelFiltro, setNivelFiltro] = useState("");
  const [consistenciaFiltro, setConsistenciaFiltro] = useState("");

  const pacientesFiltrados = pacientesMock.filter((paciente) => {
    const batePesquisa = paciente.nome.toLowerCase().includes(pesquisa.toLowerCase());
    const bateNivel = nivelFiltro === "" || paciente.nivel === nivelFiltro;
    const bateConsistencia = consistenciaFiltro === "" || paciente.status === consistenciaFiltro;
    return batePesquisa && bateNivel && bateConsistencia;
  });

  return (
    <div className="dashboard-medico">
      <aside className="dashboard-medico__sidebar">
        <NavbarProfissional />
      </aside>

      <main className="dashboard-medico__main">
        <header className="dashboard-medico__header">
          <h1 className="dashboard-medico__titulo">Pacientes</h1>
          <HeaderActions onOpenProfile={() => {}} />
        </header>

        <div className="dashboard-medico__container">
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
              {/* Dropdown Nível */}
              <div className="dropdown-container" style={{ position: "relative" }}>
                <button
                  className="dashboard-medico__filtro-dropdown"
                  onClick={() => setMenuNivelAberto(!menuNivelAberto)}
                >
                  {nivelFiltro || "Nível"} <IconeChevron />
                </button>
                {menuNivelAberto && (
                  <ul
                    className="dropdown-menu"
                    style={{
                      position: "absolute",
                      top: "100%",
                      background: "#fff",
                      border: "1px solid #ccc",
                      listStyle: "none",
                      padding: "8px",
                      margin: 0,
                      zIndex: 10,
                      width: "100%",
                    }}
                  >
                    <li
                      className="dropdown-item"
                      onClick={() => {
                        setNivelFiltro("");
                        setMenuNivelAberto(false);
                      }}
                    >
                      Todos
                    </li>
                    <li
                      className="dropdown-item"
                      onClick={() => {
                        setNivelFiltro("Iniciante");
                        setMenuNivelAberto(false);
                      }}
                    >
                      Iniciante
                    </li>
                    <li
                      className="dropdown-item"
                      onClick={() => {
                        setNivelFiltro("Intermediário");
                        setMenuNivelAberto(false);
                      }}
                    >
                      Intermediário
                    </li>
                    <li
                      className="dropdown-item"
                      onClick={() => {
                        setNivelFiltro("Avançado");
                        setMenuNivelAberto(false);
                      }}
                    >
                      Avançado
                    </li>
                  </ul>
                )}
              </div>

              {/* Dropdown Consistência */}
              <div className="dropdown-container" style={{ position: "relative" }}>
                <button
                  className="dashboard-medico__filtro-dropdown"
                  onClick={() => setMenuConsistenciaAberto(!menuConsistenciaAberto)}
                >
                  {consistenciaFiltro || "Consistência"} <IconeChevron />
                </button>
                {menuConsistenciaAberto && (
                  <ul
                    className="dropdown-menu"
                    style={{
                      position: "absolute",
                      top: "100%",
                      background: "#fff",
                      border: "1px solid #ccc",
                      listStyle: "none",
                      padding: "8px",
                      margin: 0,
                      zIndex: 10,
                      width: "100%",
                    }}
                  >
                    <li
                      className="dropdown-item"
                      onClick={() => {
                        setConsistenciaFiltro("");
                        setMenuConsistenciaAberto(false);
                      }}
                    >
                      Todos
                    </li>
                    <li
                      className="dropdown-item"
                      onClick={() => {
                        setConsistenciaFiltro("ativo");
                        setMenuConsistenciaAberto(false);
                      }}
                    >
                      Ativo
                    </li>
                    <li
                      className="dropdown-item"
                      onClick={() => {
                        setConsistenciaFiltro("inativo");
                        setMenuConsistenciaAberto(false);
                      }}
                    >
                      Inativo
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>

          <ul className="dashboard-medico__lista">
            {pacientesFiltrados.map((paciente) => (
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

            {pacientesFiltrados.length === 0 && (
              <p style={{ textAlign: "center", width: "100%", padding: "20px" }}>
                Nenhum paciente encontrado.
              </p>
            )}
          </ul>

          <button className="dashboard-medico__ver-mais">
            Ver mais <IconeChevron />
          </button>
        </div>
      </main>
    </div>
  );
};

export default DashboardMedico;
