import React from "react";
import { Bookmark } from "lucide-react"; 
import Navbar from "../../components/Navbar_reta"; 
import InfoAtividade from "../../components/InfoAtividades/InfoAtividades"; 
import { useTelaAtividadeSalva } from "./index.hook";
import "./index.css";

function TelaAtividadeSalva() {
  const { atividades, handleToggleSalvar, handleAvancar } = useTelaAtividadeSalva();

  return (
    <div className="tela-atividade-salva">
      <Navbar />

      <main className="tela-atividade-salva__painel">
        <header className="tela-atividade-salva__cabecalho">
          <Bookmark size={24} />
          <h1 className="tela-atividade-salva__titulo">Atividades salvas</h1>
        </header>
        
        <p className="tela-atividade-salva__descricao">
          Gerencie e continue as atividades que você salvou anteriormente para praticar sua leitura labial.
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
                onAvancar={handleAvancar(atividade.id)}
                onToggleSalvar={handleToggleSalvar(atividade.id)}
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

export default TelaAtividadeSalva