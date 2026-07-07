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
          /* Cor de fundo do botão roxo médio vinda de image_2.png */
          corDeFundo="#7A3A8E" 
          corTexto="#FFF"
          onClick={onComecar}
          className="btn-card"
        />
      </div>
    </div>
  );
};

export default CardExercicio;