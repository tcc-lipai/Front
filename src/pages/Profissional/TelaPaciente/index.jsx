import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/NavbarVoltar";
import BarrasDeDesempenho from "../../../components/BarrasDeDesempenho";
import InfoAtividades from "../../../components/InfoAtividades";
import { useTelaPaciente, ROTULO_STATUS } from "./index.hook";
import "./index.css";

const TelaPaciente = () => {
  const navigate = useNavigate();
  const { id, carregando, erro, paciente, desempenhoGeral, progresso, unidades, busca, setBusca } =
    useTelaPaciente();

  return (
    <div className="paciente-page-container">
      <Navbar destino="/dashboard-medico" />

      <main className="paciente-main-content">
        <div className="paciente-card-background">
          {carregando && <p className="paciente-estado">Carregando dados do paciente...</p>}
          {!carregando && erro && <p className="paciente-estado">{erro}</p>}

          {!carregando && !erro && paciente && (
            <>
              <section className="paciente-perfil-header">
                <div className="paciente-avatar-container">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="paciente-avatar-icon">
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"
                      fill="#7A3A8E"
                    />
                  </svg>
                </div>

                <div className="paciente-info-texto">
                  <h1 className="paciente-nome">{paciente.nome}</h1>

                  <div className="paciente-tags-container">
                    <span className="tag-status tag-iniciante">{paciente.nivel}</span>
                    <span className={`tag-status ${paciente.ativo ? "tag-ativo" : "tag-inativo"}`}>
                      {paciente.ativo ? "Ativo" : "Não ativo"}
                    </span>
                  </div>

                  <p className="paciente-descricao">
                    {paciente.diagnostico ? `Diagnóstico: ${paciente.diagnostico}` : "Diagnóstico não informado"}
                    {" · "}
                    {paciente.email}
                    {" · "}
                    {paciente.diasSeguidos} dia(s) seguido(s)
                  </p>
                </div>
              </section>

              <section className="paciente-desempenho-section">
                <h2 className="secao-titulo-sub">Desempenho Geral</h2>
                <div className="container-barras-wrapper">
                  <BarrasDeDesempenho dados={desempenhoGeral} />
                </div>
                <p className="paciente-legenda">
                  Interpretação e Fala: % de acerto · Vídeo e Acompanhante: % concluído.
                  {progresso && (
                    <>
                      {" "}Progresso total no nível {paciente.nivel}:{" "}
                      {progresso.atividadesConcluidas ?? progresso.AtividadesConcluidas} de{" "}
                      {progresso.totalAtividades ?? progresso.TotalAtividades} atividades (
                      {progresso.percentual ?? progresso.Percentual}%).
                    </>
                  )}
                </p>
              </section>

              <section className="paciente-busca-section">
                <div className="busca-input-wrapper">
                  <input
                    type="text"
                    placeholder="Buscar unidade"
                    aria-label="Buscar unidade"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="input-busca-paciente"
                  />
                  <svg
                    className="busca-lupa-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#7A3A8E"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                </div>
              </section>

              <section className="paciente-atividades-lista">
                {unidades.length > 0 ? (
                  unidades.map((unidade) => (
                    <InfoAtividades
                      key={unidade.id}
                      titulo={unidade.nome}
                      descricao={
                        unidade.total === 0
                          ? "Nenhuma atividade liberada para o nível atual do paciente."
                          : `${unidade.concluidas} de ${unidade.total} atividades concluídas`
                      }
                      badges={[ROTULO_STATUS[unidade.status] ?? unidade.status, `${unidade.total} atividades`]}
                      progresso={unidade.percentual}
                      semSalvar
                      rotuloAbrir={`Ver desempenho de ${paciente.nome} em ${unidade.nome}`}
                      onAvancar={() => navigate(`/paciente/${id}/unidade/${unidade.id}`)}
                    />
                  ))
                ) : (
                  <p className="paciente-estado">
                    {busca ? `Nenhuma unidade encontrada para "${busca}".` : "Nenhuma unidade disponível."}
                  </p>
                )}
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default TelaPaciente;
