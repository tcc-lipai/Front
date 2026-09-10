import "./index.css";

/**
 * Botão padrão do LipAI.
 *
 * Uso recomendado: `variante` ("primario" | "secundario" | "perigo"), que já
 * segue o tema (claro/escuro). As props de cor (corDeFundo/corTexto/corBorda)
 * são um escape para casos pontuais e sobrescrevem a variante.
 */
const Botao = ({
  texto,
  variante = "primario",
  corDeFundo,
  corTexto,
  corBorda,
  type = "button",
  onClick,
  className = "",
  ...resto
}) => {
  const temCorCustomizada = corDeFundo || corTexto || corBorda;
  const estilo = temCorCustomizada
    ? {
        backgroundColor: corDeFundo,
        color: corTexto,
        border: corBorda ? `1.5px solid ${corBorda}` : undefined,
      }
    : undefined;

  return (
    <button
      type={type}
      className={`btn-generico btn-${variante} ${className}`.trim()}
      style={estilo}
      onClick={onClick}
      {...resto}
    >
      {texto}
    </button>
  );
};

export default Botao;
