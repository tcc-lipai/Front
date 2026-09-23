import { useNavigate } from "react-router-dom";
import { Bookmark, X } from "lucide-react";
import Navbar from "../../components/NavbarVoltar";
import InfoAtividade from "../../components/InfoAtividades";
import { useTelaAtividadeSalva } from "./index.hook";
import "./index.css";

function TelaAtividadeSalva() {
  const { carregando, erro, atividades, handleRemover } = useTelaAtividadeSalva();
  const navigate = useNavigate();

  const handleSair = () => {
    navigate(-1);
  };

  return (
    <div className="tela-atividade-salva">
      <Navbar />

      <main className="tela-atividade-salva__painel">
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

        {carregando && <p className="tela-atividade-salva__vazio">Carregando...</p>}
        {!carregando && erro && <p className="tela-atividade-salva__vazio">{erro}</p>}

        {!carregando && !erro && (
          <div className="tela-atividade-salva__lista">
            {atividades.length > 0 ? (
              atividades.map((atividade) => (
                <InfoAtividade
                  key={atividade.id}
                  titulo={atividade.titulo}
                  descricao={atividade.descricao}
                  salva
                  onAvancar={() => navigate("/atividades-unidades")}
                  onToggleSalvar={handleRemover(atividade.tipoItem, atividade.itemId)}
                />
              ))
            ) : (
              <div className="tela-atividade-salva__vazio">
                <p>Você ainda não possui atividades salvas.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default TelaAtividadeSalva;
