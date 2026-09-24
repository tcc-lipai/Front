import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import Navbar from "../../components/Navbar";
import "./index.css";
import { HeaderActions } from "../../components/HeaderActions";
import { UserProfileDrawer } from "../../components/UserProfileDrawer";
import Conquistas from "../../components/Conquistas";
import { OfensivaCalendarioModal } from "../../components/OfensivaCalendarioModal";
import { useTelaDashboard } from "./index.hook";
import backgroundOnda from "../../assets/img/background_onda.png";

const UnidadeCard = ({ nome, totalAtividades, onComecar }) => (
  <div className="activity-card">
    <div className="activity-info">
      <h3 className="activity-title">{nome}</h3>
      <p className="section-subtitle">
        {totalAtividades} {totalAtividades === 1 ? "atividade" : "atividades"}
      </p>
      <button className="btn-comecar" onClick={onComecar}>
        Começar
      </button>
    </div>
  </div>
);

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
    unidadesDisponiveis,
  } = useTelaDashboard();
  const navigate = useNavigate();
  const [calendarioAberto, setCalendarioAberto] = useState(false);

  const handleAjudaOfensiva = () => {
    alert(
      "Painel de Ofensivas:\n\nAs ofensivas representam a quantidade de dias consecutivos que você completou pelo menos uma atividade no LipAI. Mantenha o foco diário para não perder sua sequência!"
    );
  };

  const diasSeguidos = usuario?.diasSeguidos ?? usuario?.DiasSeguidos ?? 0;
  const nome = usuario?.nome ?? usuario?.Nome ?? "";
  const ultimaAtividadeData = usuario?.ultimaAtividadeData ?? usuario?.UltimaAtividadeData ?? null;
  const ofensivaCongeladaAte = usuario?.ofensivaCongeladaAte ?? usuario?.OfensivaCongeladaAte ?? null;
  const usuarioId = localStorage.getItem("id");

  const strikeDays = Array.from({ length: 9 }).map((_, index) => {
    const offset = index - 4; // -4 a +4, hoje no meio
    const d = new Date();
    d.setDate(d.getDate() + offset);

    const month = d.toLocaleDateString("pt-BR", { month: "short" }).toUpperCase().replace(".", "");
    const num = d.getDate().toString().padStart(2, "0");
    const isActive = offset <= 0 && offset > -diasSeguidos;
    const distancia = Math.abs(offset);

    return { id: offset, month, num, isActive, distancia };
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
            <div className="ofensiva-header-btns">
              <button
                type="button"
                className="help-btn"
                aria-label="Ver calendário de ofensiva"
                onClick={() => setCalendarioAberto(true)}
              >
                <CalendarDays size={16} />
              </button>
              <button
                className="help-btn"
                aria-label="Ajuda sobre ofensiva"
                onClick={handleAjudaOfensiva}
              >
                ?
              </button>
            </div>
          </div>
          <div className="strike-days">
            {strikeDays.map((day) => (
              <div
                key={day.id}
                className={`strike-day ${day.isActive ? "strike-day--active" : ""} ${
                  day.id === 0 ? "strike-day--hoje" : ""
                }`}
                style={{ "--dist": day.distancia }}
              >
                <span className="strike-month">{day.month}</span>
                <span className="strike-num">{day.num}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card-section">
          <h2 className="section-title">Unidades Disponíveis</h2>
          {carregando && <p className="section-subtitle">Carregando...</p>}
          {!carregando && unidadesDisponiveis.length === 0 && (
            <p className="section-subtitle">
              Nenhuma unidade disponível ainda.{" "}
              <button className="ver-mais-btn" onClick={() => navigate("/inicio-atividades")}>
                Ver todas
              </button>
            </p>
          )}
          <div className="activities-grid">
            {unidadesDisponiveis.map((unidade) => (
              <UnidadeCard
                key={unidade.id}
                nome={unidade.nome}
                totalAtividades={unidade.totalAtividades}
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

      <OfensivaCalendarioModal
        isOpen={calendarioAberto}
        onClose={() => setCalendarioAberto(false)}
        diasSeguidos={diasSeguidos}
        ultimaAtividadeData={ultimaAtividadeData}
        ofensivaCongeladaAte={ofensivaCongeladaAte}
        usuarioId={usuarioId}
      />
    </div>
  );
};

export default TelaDashboard;
