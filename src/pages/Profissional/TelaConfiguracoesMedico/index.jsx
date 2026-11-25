import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserSidebar } from "../../../components/UserSidebar";
import { useTheme } from "../../../hooks/useTheme";
import { useTelaConfiguracoesMedico } from "./index.hook";
import "../../TelaPerfil/index.css";
import "./index.css";

const TelaConfiguracoesMedico = () => {
  const navigate = useNavigate();
  const { isDarkMode, setTheme } = useTheme();
  const h = useTelaConfiguracoesMedico();
  const [secaoAtiva, setSecaoAtiva] = useState("perfil");
  const [confirmarSaida, setConfirmarSaida] = useState(false);
  const perfilRef = useRef(null);
  const configuracoesRef = useRef(null);

  const irParaSecao = (secao) => {
    setSecaoAtiva(secao);
    const ref = secao === "perfil" ? perfilRef : configuracoesRef;
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="perfil-page-container">
      <UserSidebar
        activeSection={secaoAtiva}
        onSectionChange={irParaSecao}
        onBackClick={() => navigate("/dashboard-medico")}
        nome={h.nomeSalvo}
      />

      <main className="perfil-main-content">
        <section ref={perfilRef} className="perfil-section">
          <h1 className="prof-config__titulo">Seu Perfil</h1>

          {h.carregando && <p className="perfil-status">Carregando seus dados...</p>}
          {h.mensagem && (
            <p className="perfil-status" role="status">
              {h.mensagem}
            </p>
          )}

          <form className="perfil-form" onSubmit={h.salvar}>
            <div className="form-group">
              <label htmlFor="prof-nome">Nome:</label>
              <span>Como seus pacientes veem você</span>
              <input id="prof-nome" type="text" value={h.form.nome} onChange={h.alterar("nome")} required />
            </div>
            <div className="form-group">
              <label htmlFor="prof-email">Email:</label>
              <span>E-mail usado para entrar</span>
              <input id="prof-email" type="email" value={h.form.email} onChange={h.alterar("email")} required />
            </div>
            <div className="form-group">
              <label htmlFor="prof-registro">Registro profissional:</label>
              <span>Ex.: CRFa 0000 (opcional)</span>
              <input id="prof-registro" type="text" value={h.form.registro} onChange={h.alterar("registro")} />
            </div>
            <div className="form-group">
              <label htmlFor="prof-senha">Senha:</label>
              <span>Preencha somente se desejar trocar (mínimo de 8 caracteres)</span>
              <input
                id="prof-senha"
                type="password"
                value={h.form.senha}
                onChange={h.alterar("senha")}
                autoComplete="new-password"
              />
            </div>
            <button type="submit" className="btn-confirmar" disabled={h.salvando || h.carregando}>
              {h.salvando ? "Salvando..." : "Confirmar"}
            </button>
          </form>
        </section>

        <section ref={configuracoesRef} className="configuracoes-section">
          <h2 className="prof-config__titulo">Configurações</h2>

          <div className="prof-config__cartao">
            <div>
              <h3 className="config-card-title">Código de vínculo</h3>
              <p className="config-card-description">
                Passe este código ao paciente: ele usa em Perfil → Configurações para se vincular a você.
                {h.qtdePacientes != null && ` Pacientes vinculados: ${h.qtdePacientes}.`}
              </p>
            </div>
            <div className="prof-config__codigo">
              <strong>{h.codigo || "—"}</strong>
              <button type="button" onClick={h.copiarCodigo} disabled={!h.codigo}>
                {h.copiado ? "Copiado!" : "Copiar"}
              </button>
            </div>
          </div>

          <div className="prof-config__cartao">
            <div>
              <h3 className="config-card-title">Modo de Cor</h3>
              <p className="config-card-description">
                Ative o tema escuro para reduzir o cansaço visual em ambientes de baixa luminosidade.
              </p>
            </div>
            <label className="prof-config__tema">
              <input
                type="checkbox"
                checked={isDarkMode}
                onChange={(e) => setTheme(e.target.checked ? "dark" : "light")}
                aria-label="Ativar modo escuro"
              />
              Tema escuro
            </label>
          </div>

          <div className="prof-config__cartao">
            <div>
              <h3 className="config-card-title">Sair da conta</h3>
              <p className="config-card-description">Encerre sua sessão neste dispositivo.</p>
            </div>
            <button type="button" className="logout-button" onClick={() => setConfirmarSaida(true)}>
              Sair
            </button>
          </div>
        </section>
      </main>

      {confirmarSaida && (
        <div className="logout-modal-overlay" role="presentation" onClick={() => setConfirmarSaida(false)}>
          <div className="logout-modal" role="alertdialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <h2 className="logout-modal-title">Deseja sair da conta?</h2>
            <div className="logout-modal-actions">
              <button type="button" className="logout-modal-cancel" onClick={() => setConfirmarSaida(false)}>
                Cancelar
              </button>
              <button type="button" className="logout-modal-confirm" onClick={h.sair}>
                Sair
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TelaConfiguracoesMedico;
