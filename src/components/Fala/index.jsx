import "./index.css";

const CLASSE_POR_ESTADO = {
  ocioso: "idle",
  gravando: "recording",
  enviando: "processing",
  correto: "correct",
  incorreto: "incorrect",
  erro: "error",
};

const IconeMicrofone = () => (
  <svg
    width="32"
    height="42"
    viewBox="0 0 24 30"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path
      d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"
      fill="currentColor"
      stroke="none"
    />
    <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

const IconeOndas = () => (
  <svg width="40" height="10" viewBox="0 0 40 10" fill="currentColor">
    <circle cx="6" cy="5" r="5" />
    <circle cx="20" cy="5" r="5" />
    <circle cx="34" cy="5" r="5" />
  </svg>
);

const IconeSpinner = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" className="fala-spinner">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
    <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

/**
 * Botão de gravação da atividade de fala. É controlado pelo pai.
 *
 * @param {"ocioso"|"gravando"|"enviando"|"correto"|"incorreto"|"erro"} estado
 * @param {() => void} onClick  — só dispara nos estados clicáveis
 */
const Fala = ({ estado = "ocioso", onClick, disabled = false }) => {
  const clicavel = !disabled && (estado === "ocioso" || estado === "gravando" || estado === "erro");

  const rotulo =
    estado === "gravando"
      ? "Parar e enviar a gravação"
      : estado === "enviando"
        ? "Enviando a gravação"
        : "Gravar a sua fala";

  return (
    <button
      type="button"
      className={`fala-box ${CLASSE_POR_ESTADO[estado] || "idle"}`}
      onClick={clicavel ? onClick : undefined}
      disabled={!clicavel}
      aria-label={rotulo}
    >
      <div className="icon-container">
        {estado === "gravando" && <IconeOndas />}
        {estado === "enviando" && <IconeSpinner />}
        {estado !== "gravando" && estado !== "enviando" && <IconeMicrofone />}
      </div>
    </button>
  );
};

export default Fala;
