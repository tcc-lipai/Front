import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Conquistas from "../../components/Conquistas";
import { listarConquistasUsuario } from "../../services/conquistaService";
import { DEFAULT_CONQUISTA_DATA } from "../../components/Conquistas/index.types";
import "./index.css";

const TelaConquistas = () => {
  const navigate = useNavigate();
  const [atingidas, setAtingidas] = useState([]);
  const [naoAtingidas, setNaoAtingidas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function carregarConquistas() {
      const usuarioId = localStorage.getItem("id");
      const resultado = await listarConquistasUsuario(usuarioId);

      if (resultado.sucesso) {
        setAtingidas(resultado.data.atingidas ?? resultado.data.Atingidas ?? []);
        setNaoAtingidas(resultado.data.naoAtingidas ?? resultado.data.NaoAtingidas ?? []);
      } else {
        setErro(resultado.mensagem);
      }

      setCarregando(false);
    }

    carregarConquistas();
  }, []);

  if (carregando) return <p>Carregando conquistas...</p>;
  if (erro) return <p>{erro}</p>;

  return (
    <div className="container-tela-conquistas">
      <div className="header-conquistas">
        <button onClick={() => navigate(-1)} className="btn-voltar-conquistas">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18l-6-6 6-6"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="box-conquistas">
        <div className="secao-grid-conquistas">
          <h2>Conquistas</h2>
          <div className="grid-cards-conquistas">
            {atingidas.map((c) => (
              <Conquistas
                key={c.idConquista ?? c.IdConquista}
                title={c.nome ?? c.Nome ?? DEFAULT_CONQUISTA_DATA.title}
                subtitle={c.descricao ?? c.Descricao ?? DEFAULT_CONQUISTA_DATA.subtitle}
                iconeUrl={c.iconeUrl ?? c.IconeUrl ?? DEFAULT_CONQUISTA_DATA.iconeUrl}
              />
            ))}
          </div>
        </div>

        <div className="secao-grid-conquistas bloco-nao-atingidas">
          <h2>Não atingidas</h2>
          <div className="grid-cards-conquistas">
            {naoAtingidas.map((c) => (
              <Conquistas
                key={c.idConquista ?? c.IdConquista}
                title={c.nome ?? c.Nome ?? DEFAULT_CONQUISTA_DATA.title}
                subtitle={c.descricao ?? c.Descricao ?? DEFAULT_CONQUISTA_DATA.subtitle}
                iconeUrl={c.iconeUrl ?? c.IconeUrl ?? DEFAULT_CONQUISTA_DATA.iconeUrl}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelaConquistas;
