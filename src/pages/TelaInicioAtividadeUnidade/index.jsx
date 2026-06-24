import CardExercicio from "../../components/CardExercicio";
import Navbar from "../../components/Navbar_reta";
import Botao from "../../components/Botao";

import video from "../../assets/img/video.png";
import atividade from "../../assets/img/atividade.png";
import labios from "../../assets/img/labios.png";

import "./index.css";

const TelaInicioAtividadeUnidade = () => {
  return (
    <>
      <Navbar />

      <div className="container-atividade">
        <div className="conteudo-atividade">
          <h1>Primeira Atividade</h1>
          <div className="atividade-tags">
            <Botao
              texto="Iniciante"
              corDeFundo="#B8E5B1"
              corTexto="#5A3273"
              className="tag-nivel"
            />

            <Botao
              texto="Escrita"
              corDeFundo="#C8D0C8"
              corTexto="#5A3273"
              className="tag-nivel"
            />
          </div>
          <p className="descricao-atividade">
            Aqui vai a descrição de como vai ser a atividade e o que será
            cobrado
          </p>

          <h2>Unidade 1</h2>

          <div className="grid-cards">
            <CardExercicio
              imagem={<img src={video} alt="Vídeo" />}
              descricao="Descrição do exercício de vídeo"
            />

            <CardExercicio
              imagem={<img src={atividade} alt="Atividade" />}
              descricao="Descrição do exercício de escrita"
            />

            <CardExercicio
              imagem={<img src={labios} alt="Pronúncia" />}
              descricao="Descrição do exercício de pronúncia"
            />

            <CardExercicio
              imagem={<img src={atividade} alt="Atividade" />}
              descricao="Descrição do exercício de escrita"
            />

            <CardExercicio
              imagem={<img src={video} alt="Vídeo" />}
              descricao="Descrição do exercício de vídeo"
            />

            <CardExercicio
              imagem={<img src={labios} alt="Pronúncia" />}
              descricao="Descrição do exercício de pronúncia"
            />
          </div>

          <div className="unidade-bloqueada">
            <h2>Unidade 2</h2>

          </div>

          <div className="grid-cards">
            <CardExercicio
              imagem={<img src={video} alt="Vídeo" />}
              descricao="Descrição do exercício de vídeo"
            />

            <CardExercicio
              imagem={<img src={atividade} alt="Atividade" />}
              descricao="Descrição do exercício de escrita"
            />

            <CardExercicio
              imagem={<img src={labios} alt="Pronúncia" />}
              descricao="Descrição do exercício de pronúncia"
            />

            <CardExercicio
              imagem={<img src={atividade} alt="Atividade" />}
              descricao="Descrição do exercício de escrita"
            />

            <CardExercicio
              imagem={<img src={video} alt="Vídeo" />}
              descricao="Descrição do exercício de vídeo"
            />

            <CardExercicio
              imagem={<img src={labios} alt="Pronúncia" />}
              descricao="Descrição do exercício de pronúncia"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TelaInicioAtividadeUnidade;