import "./index.css";

import IconGelo from "../../assets/img/IconGelo.jpg";
import IconMoedas from "../../assets/img/IconMoedas.jpg";
import IconBau from "../../assets/img/IconBau.jpg";

const ICONES = { gelo: IconGelo, moedas: IconMoedas, bau: IconBau };

export default function ProdutoLoja({
  title,
  description,
  price,
  tipo,
  isBlocked = false,
  comprando = false,
  onComprar,
}) {
  const iconeAtual = ICONES[tipo] ?? null;

  return (
    <div className={`card-produto-figma ${isBlocked ? "bloqueado" : ""}`}>
      <div className="card-conteudo-figma">
        <div className="card-icone-wrapper-figma">
          {iconeAtual ? (
            <img src={iconeAtual} alt={title} className="card-icone-figma" />
          ) : (
            <div className="card-icone-placeholder-figma" />
          )}
        </div>

        <div className="card-info-figma">
          <div className="card-textos-figma">
            <h3 className="card-titulo-figma">{title}</h3>
            <p className="card-descricao-figma">{description}</p>
          </div>

          <div className="card-preco-wrapper-figma">
            <button
              type="button"
              className="card-botao-preco-figma"
              onClick={onComprar}
              disabled={comprando}
              aria-label={`Comprar ${title} por ${price} moedas`}
            >
              <span className="preco-texto-figma">{comprando ? "..." : price}</span>
              <span className="preco-estrela-figma">⭐</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
