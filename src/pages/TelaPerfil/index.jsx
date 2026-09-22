import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserSidebar } from "../../components/UserSidebar";
import { useTheme } from "../../hooks/useTheme";
import useLogout from "./index.hook";
import {
  buscarUsuario,
  atualizarUsuario,
  buscarProgresso,
  contarAtividadesConcluidas,
  calcularPercentualAtividades,
} from "../../services/usuarioService";
import { listarUnidades, contarLicoesDasUnidades } from "../../services/unidadeService";
import { lerPreferencias, salvarPreferencias } from "../../services/preferenciasService";
import "./index.css";

const RAIO_CIRCULO = 40;
const CIRCUNFERENCIA = 2 * Math.PI * RAIO_CIRCULO;

const TelaPerfil = () => {
  const [secaoAtiva, setSecaoAtiva] = useState("perfil");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [nivelDificuldade, setNivelDificuldade] = useState(1);
  const [confirmarSaidaAberto, setConfirmarSaidaAberto] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [percentualAtividades, setPercentualAtividades] = useState(0);

  const navigate = useNavigate();
  const { handleLogout } = useLogout();
  const { isDarkMode, setTheme } = useTheme();
  const perfilRef = useRef(null);
  const configuracoesRef = useRef(null);
  const usuarioId = localStorage.getItem("id");
  const [notificacoes, setNotificacoes] = useState(() => lerPreferencias(usuarioId).notificacoes);

  useEffect(() => {
    let ativo = true;

    async function carregarPerfil() {
      const [perfilRes, progressoRes, unidadesRes] = await Promise.all([
        buscarUsuario(usuarioId),
        buscarProgresso(usuarioId),
        listarUnidades(),
      ]);

      if (!ativo) return;

      if (perfilRes.sucesso) {
        const perfil = perfilRes.data;
        setNome(perfil.Nome ?? perfil.nome ?? "");
        setEmail(perfil.Email ?? perfil.email ?? "");
        setDiagnostico(perfil.Diagnostico ?? perfil.diagnostico ?? "");
        setNivelDificuldade(perfil.NivelDificuldade ?? perfil.nivelDificuldade ?? 1);
      } else {
        setNome(localStorage.getItem("nome") || "");
        setEmail(localStorage.getItem("email") || "");
        setMensagem("Não foi possível carregar todos os dados do perfil.");
      }

      if (progressoRes.sucesso && unidadesRes.sucesso) {
        const concluidas = contarAtividadesConcluidas(progressoRes.data);
        const totalLicoes = contarLicoesDasUnidades(unidadesRes.data);
        setPercentualAtividades(calcularPercentualAtividades(concluidas, totalLicoes));
      }

      setCarregando(false);
    }

    carregarPerfil();
    return () => {
      ativo = false;
    };
  }, [usuarioId]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setSecaoAtiva(entry.target.dataset.secao);
          }
        });
      },
      { threshold: 0.4 }
    );

    if (perfilRef.current) observer.observe(perfilRef.current);
    if (configuracoesRef.current) observer.observe(configuracoesRef.current);

    return () => observer.disconnect();
  }, []);

  const alterarTema = (ativo) => {
    setTheme(ativo ? "dark" : "light");
    salvarPreferencias(
      {
        ...lerPreferencias(usuarioId),
        modoEscuro: ativo,
        notificacoes,
      },
      usuarioId
    );
  };

  const alterarNotificacoes = (ativo) => {
    setNotificacoes(ativo);
    salvarPreferencias(
      {
        ...lerPreferencias(usuarioId),
        modoEscuro: isDarkMode,
        notificacoes: ativo,
      },
      usuarioId
    );
  };

  const handleSalvar = async (event) => {
    event.preventDefault();
    setSalvando(true);
    setMensagem("");

    const resultado = await atualizarUsuario(usuarioId, {
      nome,
      email,
      senha,
      diagnostico,
      nivelDificuldade,
    });

    if (resultado.sucesso) {
      setMensagem("Dados atualizados com sucesso.");
      setSenha("");
    } else {
      setMensagem(resultado.mensagem);
    }

    setSalvando(false);
  };

  const handleSectionChange = (secao) => {
    setSecaoAtiva(secao);
    const ref = secao === "perfil" ? perfilRef : configuracoesRef;
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const confirmarLogout = () => {
    setConfirmarSaidaAberto(false);
    handleLogout();
  };

  const offset = CIRCUNFERENCIA - (percentualAtividades / 100) * CIRCUNFERENCIA;

  return (
    <div className="perfil-page-container">
      <div className="bg-waves" aria-hidden="true">
        <svg
          viewBox="0 0 1440 1024"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M1440 0H900C1100 200 1050 500 1250 750C1350 870 1390 960 1440 1024V0Z"
            fill="#ecdcf7"
            opacity="0.6"
          />
          <path
            d="M1440 250C1200 450 1280 700 1100 850C1000 930 920 970 850 1024H1440V250Z"
            fill="#f0e4fa"
            opacity="0.5"
          />
          <path
            d="M1440 600C1350 720 1380 850 1200 950C1120 990 1050 1010 1000 1024H1440V600Z"
            fill="#e6d2f5"
            opacity="0.4"
          />
        </svg>
      </div>

      <UserSidebar
        activeSection={secaoAtiva}
        onSectionChange={handleSectionChange}
        onBackClick={() => navigate(-1)}
        nome={nome}
      />

      <main className="perfil-main-content">
        <section ref={perfilRef} data-secao="perfil" className="perfil-section">
          <div className="perfil-header">
            <h1 className="perfil-title">Seu Perfil</h1>
            <div
              className="progress-container"
              aria-label={`${percentualAtividades}% das atividades concluídas`}
            >
              <button
                className="btn-voltar"
                type="button"
                onClick={() => navigate(-1)}
                aria-label="Voltar"
              />
              <svg className="progress-svg" viewBox="0 0 90 90" role="img" aria-hidden="true">
                <circle className="progress-circle-bg" cx="45" cy="45" r={RAIO_CIRCULO} />
                <circle
                  className="progress-circle-bar"
                  cx="45"
                  cy="45"
                  r={RAIO_CIRCULO}
                  strokeDasharray={CIRCUNFERENCIA}
                  strokeDashoffset={offset}
                />
              </svg>
              <div className="progress-text">
                <strong>{percentualAtividades}%</strong>
                <br />
                <span>Atividades</span>
              </div>
            </div>
          </div>

          {carregando && <p className="perfil-status">Carregando seus dados...</p>}
          {mensagem && (
            <p className="perfil-status" role="status">
              {mensagem}
            </p>
          )}

          <form className="perfil-form" onSubmit={handleSalvar}>
            <div className="form-group">
              <label htmlFor="perfil-nome">Nome:</label>
              <span>Altere seu nome completo cadastrado na conta</span>
              <input
                id="perfil-nome"
                type="text"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="perfil-email">Email:</label>
              <span>Gerencie seu endereço de email principal de acesso</span>
              <input
                id="perfil-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="perfil-senha">Senha:</label>
              <span>Preencha somente se desejar alterar sua senha</span>
              <input
                id="perfil-senha"
                type="password"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                autoComplete="new-password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="perfil-diagnostico">Diagnóstico:</label>
              <span>Insira ou edite os dados do seu diagnóstico médico atual</span>
              <input
                id="perfil-diagnostico"
                type="text"
                value={diagnostico}
                onChange={(event) => setDiagnostico(event.target.value)}
              />
            </div>
            <button type="submit" className="btn-confirmar" disabled={salvando || carregando}>
              {salvando ? "Salvando..." : "Confirmar"}
            </button>
          </form>
        </section>

        <section
          ref={configuracoesRef}
          data-secao="configuracoes"
          className="configuracoes-section"
        >
          <div className="configuracoes-grid">
            <div className="config-card">
              <h3 className="config-card-title">Modo de Cor</h3>
              <p className="config-card-description">
                Ative o tema escuro para reduzir o cansaço visual em ambientes de baixa
                luminosidade.
              </p>
              <div className="config-card-action">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={isDarkMode}
                    onChange={(event) => alterarTema(event.target.checked)}
                    aria-label="Ativar modo escuro"
                  />
                  <span className="slider round" />
                </label>
              </div>
            </div>

            <div className="config-card">
              <h3 className="config-card-title">Notificações</h3>
              <p className="config-card-description">
                Receba alertas e atualizações importantes sobre o seu perfil diretamente no sistema.
              </p>
              <div className="config-card-action">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={notificacoes}
                    onChange={(event) => alterarNotificacoes(event.target.checked)}
                    aria-label="Receber notificações"
                  />
                  <span className="slider round" />
                </label>
              </div>
            </div>
          </div>

          <div className="logout-section-wrapper">
            <div className="config-card-wide config-card-logout">
              <div className="wide-info">
                <h3 className="config-card-title">Sair da conta</h3>
                <p className="config-card-description">
                  Encerre sua sessão atual neste dispositivo. Você precisará fazer login novamente
                  para acessar sua conta.
                </p>
              </div>
              <div className="wide-actions">
                <button
                  className="logout-button"
                  type="button"
                  onClick={() => setConfirmarSaidaAberto(true)}
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {confirmarSaidaAberto && (
        <div
          className="logout-modal-overlay"
          role="presentation"
          onClick={() => setConfirmarSaidaAberto(false)}
        >
          <div
            className="logout-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="logout-modal-title"
            aria-describedby="logout-modal-desc"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="logout-modal-icon" aria-hidden="true">
              ↪
            </div>
            <h2 id="logout-modal-title" className="logout-modal-title">
              Deseja realmente sair?
            </h2>
            <p id="logout-modal-desc" className="logout-modal-desc">
              Você será desconectado da sua conta neste dispositivo e precisará fazer login
              novamente para continuar.
            </p>
            <div className="logout-modal-actions">
              <button
                className="logout-modal-cancel"
                type="button"
                onClick={() => setConfirmarSaidaAberto(false)}
              >
                Cancelar
              </button>
              <button className="logout-modal-confirm" type="button" onClick={confirmarLogout}>
                Sim, sair
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TelaPerfil;
