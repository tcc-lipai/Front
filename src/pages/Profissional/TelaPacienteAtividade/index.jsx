import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../../components/Navbar_reta";
import BarrasDeDesempenho from "../../../components/BarrasDeDesempenho";
import InfoAtividade from "../../../components/InfoAtividades/InfoAtividades"; 
import "./index.css";

const TelaPacienteAtividades = () => {
  const { id } = useParams(); // Pega o ID da rota para saber qual atividade exibir

  // Dados simulados de desempenho para as unidades (conforme o print do Figma)
  const [dadosUnidade] = useState([
    { label: "Interpretação", acertos: 7.5, total: 10 },
    { label: "Fala", acertos: 9, total: 10 },
    { label: "Video", acertos: 9, total: 10 }
  ]);

  // Lista de blocos de desempenho por unidade
  const unidades = [
    { id: 1, titulo: "Desempenho na Unidade 1" },
    { id: 2, titulo: "Desempenho na Unidade 1" },
    { id: 3, titulo: "Desempenho na Unidade 1" }
  ];

  return (
    <div className="atividade-detalhe-page-container">
      <Navbar />

      <main className="atividade-detalhe-main-content">
        <div className="atividade-detalhe-card-background">
          
          {/* SEÇÃO DO TOPO: O seu próprio componente InfoAtividade é renderizado aqui */}
          <section className="atividade-detalhe-topo-card">
            <InfoAtividade 
              titulo="Primeira Atividade"
              descricao="Aqui vai a descrição de como vai ser a atividade e o que será cobrado"
              dificuldade="Iniciante"
              tipo="Escrita"
              progresso={65} // Pode passar o progresso atual do paciente
              className="info-atividade--aberta" // Classe opcional para customizar se precisar
            />
          </section>

          {/* SEÇÃO DE BAIXO: Mapeamento dos blocos de desempenho por Unidade */}
          <div className="unidades-container-lista">
            {unidades.map((unidade) => (
              <section key={unidade.id} className="unidade-desempenho-block">
                <h2 className="unidade-titulo-sub">{unidade.titulo}</h2>
                <div className="unidade-barras-wrapper">
                  <BarrasDeDesempenho dados={dadosUnidade} />
                </div>
              </section>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
};

export default TelaPacienteAtividades;