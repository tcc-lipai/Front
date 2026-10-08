import { Check } from "lucide-react";
import "./index.css";
import Botao from "../Botao";

const CardExercicio = ({
  imagem,
  titulo,
  descricao,
  corDestaque = "#7A3A8E",
  concluida = false,
  onComecar,
}) => {
  return (
    <div className="card-exercicio" style={{ "--cor-destaque": corDestaque }}>
      <div className="card-exercicio__icone-wrapper">
        <div className="card-exercicio__icone">{imagem}</div>
        {concluida && (
          <span className="card-exercicio__selo" title="Você já concluiu essa atividade">
            <Check size={12} strokeWidth={3} />
          </span>
        )}
      </div>

      <div className="card-exercicio__info">
        {titulo && <strong className="card-exercicio__titulo">{titulo}</strong>}
        <p className="card-exercicio__descricao">{descricao}</p>
      </div>

      <Botao
        texto={concluida ? "Refazer" : "Começar"}
        variante={concluida ? "secundario" : "primario"}
        corDeFundo={concluida ? undefined : "var(--cor-destaque)"}
        corTexto={concluida ? undefined : "#FFF"}
        onClick={onComecar}
        className="card-exercicio__botao"
      />
    </div>
  );
};

export default CardExercicio;
