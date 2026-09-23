import { useNavigate } from "react-router-dom";
import { Mic, HelpCircle, Video as VideoIcon } from "lucide-react";
import Navbar from "../../components/Navbar";
import "./index.css";
import { HeaderActions } from "../../components/HeaderActions";
import { UserProfileDrawer } from "../../components/UserProfileDrawer";
import Conquistas from "../../components/Conquistas";
import { useTelaDashboard } from "./index.hook";
import backgroundOnda from "../../assets/img/background_onda.png";

const ICONE_POR_TIPO = {
  fala: { Icone: Mic, cor: "#8A3FA0" },
  alternativa: { Icone: HelpCircle, cor: "#E0932E" },
  video: { Icone: VideoIcon, cor: "#4E8FD6" },
};

const ActivityCard = ({ titulo, tipo, onComecar }) => {
  const { Icone, cor } = ICONE_POR_TIPO[tipo] ?? ICONE_POR_TIPO.fala;

  return (
    <div className="activity-card">
      <div className="activity-icon" style={{ borderColor: cor }}>
        <Icone size={28} color={cor} strokeWidth={2.2} />
      </div>
      <div className="activity-info">
        <h3 className="activity-title">{titulo}</h3>
        <button className="btn-comecar" onClick={onComecar}>
          Começar
        </button>
      </div>
    </div>
  );
};

const PerformanceBar = ({ label, value, color }) => (
  <div className="perf-row">
    <span className="perf-label">
      <span className="perf-dot" style={{ background: color }} />
      {label}
    </span>
    <div className="perf-track">
      <div className="perf-fill" style={{ width: `${value}%`, background: color }} />
    </div>
    <span className="perf-value">{value}%</span>
  </div>
);

const TelaDashboard = () => {
  const {
    drawerAberto,
    abrirPerfil,
    fecharPerfil,
    carregando,
    usuario,
    desempenho,
    conquistas,
    atividadesRecentes,
  } = useTelaDashboard();
  const navigate = useNavigate();

  const handleAjudaOfensiva = () => {
    alert(
      "Painel de Ofensivas:\n\nAs ofensivas representam a quantidade de dias consecutivos que você completou pelo menos uma atividade no LipAI. Mantenha o foco diário para não perder sua sequência!"
    );
  };

  const diasSeguidos = usuario?.diasSeguidos ?? usuario?.DiasSeguidos ?? 0;
  const nome = usuario?.nome ?? usuario?.Nome ?? "";

  const strikeDays = Array.from({ length: 9 }).map((_, index) => {
    const offset = index - 4; // -4 to +4
    const d = new Date();
    d.setDate(d.getDate() + offset);
    
    const month = d.toLocaleDateString("pt-BR", { month: "short" }).toUpperCase().replace(".", "");
    const num = d.getDate().toString().padStart(2, "0");
    const isActive = offset <= 0 && offset > -diasSeguidos;

    return { id: offset, month, num, isActive };
  });

  return (
    <div className="dashboard-wrapper" style={{ backgroundImage: `url(${backgroundOnda})` }}>
      <Navbar />

      <div className="dashboard-main">
        <div className="dashboard-header">
          <h1 className="dashboard-title">{nome ? `Olá, ${nome}!` : "Dashboard"}</h1>
          <div className="header-right">
            <HeaderActions onOpenProfile={abrirPerfil} />
            <UserProfileDrawer isOpen={drawerAberto} onClose={fecharPerfil} />
          </div>
        </div>

        <section className="card-section">
          <div className="section-title-row">
            <div>
              <h2 className="section-title">Ofensiva</h2>
              <p className="section-subtitle">
                Complete ao menos uma lição por dia, para manter a ofensiva.
              </p>
            </div>
            <button
              className="help-btn"
              aria-label="Ajuda sobre ofensiva"
              onClick={handleAjudaOfensiva}
            >
              ?
            </button>
          </div>
          <div className="strike-days">
            {strikeDays.map((day) => (
              <div
                key={day.id}
                className={`strike-day ${day.isActive ? "strike-day--active" : ""}`}
              >
                <span className="strike-month">{day.month}</span>
                <span className="strike-num">{day.num}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card-section">
          <h2 className="section-title">Atividades Recentes</h2>
          {carregando && <p className="section-subtitle">Carregando...</p>}
          {!carregando && atividadesRecentes.length === 0 && (
            <p className="section-subtitle">
              Nenhuma atividade disponível ainda.{" "}
              <button className="ver-mais-btn" onClick={() => navigate("/inicio-atividades")}>
                Ver todas
              </button>
            </p>
          )}
          <div className="activities-grid">
            {atividadesRecentes.map((atividade) => (
              <ActivityCard
                key={`${atividade.tipo}-${atividade.id}`}
                titulo={atividade.titulo}
                tipo={atividade.tipo}
                onComecar={() => navigate("/atividades-unidades")}
              />
            ))}
          </div>
        </section>

        <section className="card-section">
          <div className="section-title-row">
            <div>
              <h2 className="section-title">Conquistas</h2>
              <p className="section-subtitle">Veja suas conquistas</p>
            </div>
            <button className="ver-mais-btn" onClick={() => navigate("/conquistas")}>
              Ver mais
            </button>
          </div>
          {!carregando && conquistas.length === 0 && (
            <p className="section-subtitle">Você ainda não conquistou nenhuma medalha.</p>
          )}
          <div className="conquistas-grid">
            {conquistas.map((conquista) => (
              <Conquistas
                key={conquista.idConquista ?? conquista.IdConquista}
                title={conquista.nome ?? conquista.Nome}
                subtitle={conquista.descricao ?? conquista.Descricao}
                iconeUrl={conquista.iconeUrl ?? conquista.IconeUrl}
              />
            ))}
          </div>
        </section>

        <section className="card-section">
          <h2 className="section-title">Desempenho</h2>
          <p className="section-subtitle">
            Veja seu desempenho nas atividades de interpretação e fala.
          </p>
          <div className="perf-list">
            <PerformanceBar
              label="Interpretação"
              value={desempenho.interpretacao}
              color="#F0BFFF"
            />
            <PerformanceBar label="Fala" value={desempenho.fala} color="#B78CC4" />
          </div>
        </section>
      </div>
    </div>
  );
};

export default TelaDashboard;
