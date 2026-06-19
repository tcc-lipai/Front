import "./index.css";
import Botao from "../Botao";

const CardExercicio = ({
  imagem,
  descricao,
  onComecar,
}) => {
  return (
    <div className="card-exercicio">
      <div className="card-imagem">
        {imagem}
      </div>

      <div className="card-info">
        <p>{descricao}</p>

        <Botao
          texto="Começar"
          corDeFundo="#7D3A93"
          corTexto="#FFF"
          onClick={onComecar}
          className="btn-card"
        />
      </div>
    </div>
  );
};

export default CardExercicio;