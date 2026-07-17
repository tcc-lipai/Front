import Navbar from '../../components/Navbar/index';
import './index.css';
import { HeaderActions } from '../../components/infoEstrelas/index';
import { UserProfileDrawer } from '../../components/UserProfileDrawer/index';
import Conquistas from '../../components/Conquistas/index';

const HeadphoneIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="31" stroke="#9B59B6" strokeWidth="2" fill="none"/>
    <path d="M16 32C16 23.163 23.163 16 32 16C40.837 16 48 23.163 48 32" stroke="#9B59B6" strokeWidth="2.5" strokeLinecap="round"/>
    <rect x="13" y="30" width="7" height="12" rx="3.5" fill="#9B59B6"/>
    <rect x="44" y="30" width="7" height="12" rx="3.5" fill="#9B59B6"/>
    <path d="M26 34 Q32 30 38 34" stroke="#9B59B6" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    <path d="M28 37 Q32 34 36 37" stroke="#9B59B6" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    <path d="M30 40 Q32 38 34 40" stroke="#9B59B6" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
  </svg>
);

const strikeDays = [
  { label: 'MAR', day: '04' },
  { label: 'MAR', day: '04' },
  { label: 'MAR', day: '04' },
  { label: 'MAR', day: '04' },
  { label: 'MAR', day: '06', active: true },
  { label: 'MAR', day: '04' },
  { label: 'MAR', day: '04' },
  { label: 'MAR', day: '04' },
  { label: 'MAR', day: '04' },
];

const ActivityCard = ({ title, description }) => (
  <div className="activity-card">
    <div className="activity-icon">
      <HeadphoneIcon />
    </div>
    <div className="activity-info">
      <h3 className="activity-title">{title}</h3>
      <p className="activity-desc">{description}</p>
      <button className="btn-comecar">Começar</button>
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
  return (
    <div className="dashboard-wrapper">
      <Navbar />

      <div className="dashboard-main">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <div className="header-right">
            <HeaderActions />
            <UserProfileDrawer />
          </div>
        </div>

        <section className="card-section">
          <div className="section-title-row">
            <div>
              <h2 className="section-title">Ofensiva</h2>
              <p className="section-subtitle">Complete ao menos uma lição por dia, para manter a ofensiva.</p>
            </div>
            <button className="help-btn" aria-label="Ajuda sobre ofensiva">?</button>
          </div>
          <div className="strike-days">
            {strikeDays.map((d, i) => (
              <div key={i} className={`strike-day${d.active ? ' strike-day--active' : ''}`}>
                <span className="strike-month">{d.label}</span>
                <span className="strike-num">{d.day}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card-section">
          <h2 className="section-title">Atividades Recentes</h2>
          <div className="activities-grid">
            <ActivityCard
              title="Escutando"
              description="lorem ldwadw vlalla blal dwaddw awddwadwadwadw dwadwa"
            />
            <ActivityCard
              title="Escutando"
              description="lorem ldwadw vlalla blal dwaddw awddwadwadwadw dwadwa"
            />
          </div>
        </section>

        <section className="card-section">
          <div className="section-title-row">
            <div>
              <h2 className="section-title">Conquistas</h2>
              <p className="section-subtitle">Veja suas conquistas</p>
            </div>
            <button className="ver-mais-btn">Ver mais</button>
          </div>
          <div className="conquistas-grid">
            <Conquistas title="Semana Ouro" subtitle="Semana Ouro" />
            <Conquistas title="Semana Ouro" subtitle="Semana Ouro" />
            <Conquistas title="Semana Ouro" subtitle="Semana Ouro" />
            <Conquistas title="Semana Ouro" subtitle="Semana Ouro" />
          </div>
        </section>

        <section className="card-section">
          <h2 className="section-title">Desempenho</h2>
          <p className="section-subtitle">Veja seu desempenho nas atividades de escuta, fala, interpretação e</p>
          <div className="perf-list">
            <PerformanceBar label="Interpretação" value={70} color="#e879f9" />
            <PerformanceBar label="Fala" value={90} color="#7c3aed" />
          </div>
        </section>
      </div>
    </div>
  );
};

export default TelaDashboard;