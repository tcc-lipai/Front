import "./index.css";
import Botao from "../Botao";

const CardExercicio = ({ imagem, titulo, descricao, corDestaque = "#7A3A8E", onComecar }) => {
  return (
    <div className="card-exercicio" style={{ "--cor-destaque": corDestaque }}>
      <div className="card-exercicio__icone">{imagem}</div>

      <div className="card-exercicio__info">
        {titulo && <strong className="card-exercicio__titulo">{titulo}</strong>}
        <p className="card-exercicio__descricao">{descricao}</p>
      </div>

      <Botao
        texto="Começar"
        corDeFundo="var(--cor-destaque)"
        corTexto="#FFF"
        onClick={onComecar}
        className="card-exercicio__botao"
      />
    </div>
  );
};

export default CardExercicio;
