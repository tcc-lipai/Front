import React from "react";
import { useNavigate } from "react-router-dom";
import CardExercicio from "../../components/CardExercicio";
import Navbar from "../../components/NavbarVoltar";
import Botao from "../../components/Botao";

import video from "../../assets/img/video.png";
import atividade from "../../assets/img/atividade.png";
import labios from "../../assets/img/labios.png";

import "./index.css";

const TelaInicioAtividadeUnidade = () => {
  const navigate = useNavigate();

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

            <Botao texto="Escrita" corDeFundo="#C8D0C8" corTexto="#5A3273" className="tag-nivel" />
          </div>
          <p className="descricao-atividade">
            Aqui vai a descrição de como vai ser a atividade e o que será cobrado
          </p>

          <h2>Unidade 1</h2>

          <div className="grid-cards">
            {/* Apontando para a rota de vídeo real com um ID padrão (ex: 1) */}
            <CardExercicio
              imagem={<img src={video} alt="Vídeo" />}
              descricao="Descrição do exercício de vídeo"
              onComecar={() => navigate("/atividade/video/1")}
            />

            {/* Apontando para a rota de alternativa/escrita real */}
            <CardExercicio
              imagem={<img src={atividade} alt="Atividade" />}
              descricao="Descrição do exercício de escrita"
              onComecar={() => navigate("/teste-atividade")}
            />

            {/* Apontando para a rota de fala real com um ID padrão (ex: 1) */}
            <CardExercicio
              imagem={<img src={labios} alt="Pronúncia" />}
              descricao="Descrição do exercício de pronúncia"
              onComecar={() => navigate("/atividade/fala/1")}
            />

            <CardExercicio
              imagem={<img src={atividade} alt="Atividade" />}
              descricao="Descrição do exercício de escrita"
              onComecar={() => navigate("/teste-atividade")}
            />

            <CardExercicio
              imagem={<img src={video} alt="Vídeo" />}
              descricao="Descrição do exercício de vídeo"
              onComecar={() => navigate("/atividade/video/1")}
            />

            <CardExercicio
              imagem={<img src={labios} alt="Pronúncia" />}
              descricao="Descrição do exercício de pronúncia"
              onComecar={() => navigate("/atividade/fala/1")}
            />
          </div>

          <div className="unidade-bloqueada">
            <h2>Unidade 2</h2>
          </div>

          <div className="grid-cards">
            <CardExercicio
              imagem={<img src={video} alt="Vídeo" />}
              descricao="Descrição do exercício de vídeo"
              onComecar={() => navigate("/atividade/video/1")}
            />

            <CardExercicio
              imagem={<img src={atividade} alt="Atividade" />}
              descricao="Descrição do exercício de escrita"
              onComecar={() => navigate("/teste-atividade")}
            />

            <CardExercicio
              imagem={<img src={labios} alt="Pronúncia" />}
              descricao="Descrição do exercício de pronúncia"
              onComecar={() => navigate("/atividade/fala/1")}
            />

            <CardExercicio
              imagem={<img src={atividade} alt="Atividade" />}
              descricao="Descrição do exercício de escrita"
              onComecar={() => navigate("/teste-atividade")}
            />

            <CardExercicio
              imagem={<img src={video} alt="Vídeo" />}
              descricao="Descrição do exercício de vídeo"
              onComecar={() => navigate("/atividade/video/1")}
            />

            <CardExercicio
              imagem={<img src={labios} alt="Pronúncia" />}
              descricao="Descrição do exercício de pronúncia"
              onComecar={() => navigate("/atividade/fala/1")}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TelaInicioAtividadeUnidade;
