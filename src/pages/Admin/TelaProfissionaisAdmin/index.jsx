import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarAdmin from "../../../components/NavbarAdmin";
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

const usuariosMock = [
  {
    id: 1,
    nome: "Profissional 1",
    descricao: "lorem...",
    nivel: "Iniciante",
    status: "ativo",
    tipo: "paciente-admin",
  },
  {
    id: 2,
    nome: "Profissional 2",
    descricao: "lorem...",
    nivel: "Intermediário",
    status: "inativo",
    tipo: "paciente-admin",
  },
  {
    id: 3,
    nome: "Profissional 3",
    descricao: "lorem...",
    nivel: "Iniciante",
    status: "ativo",
    tipo: "paciente-admin",
  },
  {
    id: 4,
    nome: "Profissional 4",
    descricao: "lorem...",
    nivel: "Avançado",
    status: "inativo",
    tipo: "paciente-admin",
  },
];

const ProfissionaisAdmin = () => {
  const [pesquisa, setPesquisa] = useState("");
  const navigate = useNavigate();

  const [menuNivelAberto, setMenuNivelAberto] = useState(false);
  const [menuConsistenciaAberto, setMenuConsistenciaAberto] = useState(false);
  const [nivelFiltro, setNivelFiltro] = useState("");
  const [consistenciaFiltro, setConsistenciaFiltro] = useState("");

  const usuariosFiltrados = usuariosMock.filter((usuario) => {
    const batePesquisa = usuario.nome.toLowerCase().includes(pesquisa.toLowerCase());
    const bateNivel = nivelFiltro === "" || usuario.nivel === nivelFiltro;
    const bateConsistencia = consistenciaFiltro === "" || usuario.status === consistenciaFiltro;
    return batePesquisa && bateNivel && bateConsistencia;
  });

  return (
    <div className="dashboard-admin">
      <aside className="dashboard-admin__sidebar">
        <NavbarAdmin />
      </aside>

      <main className="dashboard-admin__main">
        <header className="dashboard-admin__header">
          <h1 className="dashboard-admin__titulo">Profissionais</h1>
        </header>

        <div className="dashboard-admin__container">
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
              <div className="dropdown-container" style={{ position: "relative" }}>
                <button
                  className="dashboard-admin__filtro-dropdown"
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

              <div className="dropdown-container" style={{ position: "relative" }}>
                <button
                  className="dashboard-admin__filtro-dropdown"
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

          <ul className="dashboard-admin__lista">
            {usuariosFiltrados.map((usuario) => (
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

            {usuariosFiltrados.length === 0 && (
              <p style={{ textAlign: "center", width: "100%", padding: "20px" }}>
                Nenhum profissional encontrado.
              </p>
            )}
          </ul>

          <div className="dashboard-admin__rodape">
            <button className="dashboard-admin__ver-mais">
              Ver mais <IconeChevron />
            </button>
            <Botao
              texto="Cadastrar"
              onClick={() => navigate("/cadastrar-paciente")} // Pode precisar alterar a rota aqui dependendo da tela
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfissionaisAdmin;
