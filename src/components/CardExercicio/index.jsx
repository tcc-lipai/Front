import { Check } from "lucide-react";
import "./index.css";
import Botao from "../Botao";

const CardExercicio = ({
  imagem,
  titulo,
  descricao,
  corDestaque = "#7A3A8E",
  concluida = false,
  acerto = null,
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
        {concluida && acerto != null && (
          <div className="card-exercicio__acerto" title={`Nível de acerto: ${Math.round(acerto)}%`}>
            <div className="card-exercicio__acerto-trilho">
              <div
                className="card-exercicio__acerto-preenchimento"
                style={{ width: `${Math.min(Math.round(acerto), 100)}%` }}
              />
            </div>
            <span className="card-exercicio__acerto-valor">{Math.round(acerto)}%</span>
          </div>
        )}
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
