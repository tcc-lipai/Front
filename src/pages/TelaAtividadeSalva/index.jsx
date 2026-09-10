import React from "react";
import { useNavigate } from "react-router-dom"; // <-- 1. Importando o useNavigate
import { Bookmark, X } from "lucide-react"; // <-- 2. Importando o ícone de X
import Navbar from "../../components/NavbarVoltar";
import InfoAtividade from "../../components/InfoAtividades";
import { useTelaAtividadeSalva } from "./index.hook";
import "./index.css";

function TelaAtividadeSalva() {
  const { atividades, handleToggleSalvar, handleAvancar } = useTelaAtividadeSalva();
  const navigate = useNavigate(); // <-- 3. Inicializando a navegação

  // 4. Criando a função para voltar/sair
  const handleSair = () => {
    navigate(-1); // Volta para a tela anterior. Se quiser ir para o início, mude para navigate("/")
  };

  return (
    <div className="tela-atividade-salva">
      <Navbar />

      <main className="tela-atividade-salva__painel">
        {/* 5. Adicionando o botão de sair no cabeçalho */}
        <header
          className="tela-atividade-salva__cabecalho"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Bookmark size={24} />
            <h1 className="tela-atividade-salva__titulo">Atividades salvas</h1>
          </div>

          <button
            className="btn-fechar"
            onClick={handleSair}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <X size={32} color="#5B2D74" />
          </button>
        </header>

        <p className="tela-atividade-salva__descricao">
          Gerencie e continue as atividades que você salvou anteriormente para praticar sua leitura
          labial.
        </p>

        <div className="tela-atividade-salva__lista">
          {atividades.length > 0 ? (
            atividades.map((atividade) => (
              <InfoAtividade
                key={atividade.id}
                titulo={atividade.titulo}
                descricao={atividade.descricao}
                dificuldade={atividade.dificuldade}
                tipo={atividade.tipo}
                progresso={atividade.progresso}
                salva={atividade.salva}
                // Ajuste importante: envelopando as funções para não executarem sozinhas ao renderizar
                onAvancar={() => handleAvancar(atividade.id)}
                onToggleSalvar={() => handleToggleSalvar(atividade.id)}
              />
            ))
          ) : (
            <div className="tela-atividade-salva__vazio">
              <p>Você ainda não possui atividades salvas.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default TelaAtividadeSalva;
