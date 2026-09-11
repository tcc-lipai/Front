import { useEffect, useState } from "react";
import { listarAtividadesSalvas, dessalvarAtividade } from "../../services/atividadeService";

function normalizar(atividade) {
  return {
    id: atividade.idAtividade ?? atividade.IdAtividade,
    titulo: atividade.nome ?? atividade.Nome ?? "Atividade",
    descricao: atividade.descricao ?? atividade.Descricao ?? "",
  };
}

export function useTelaAtividadeSalva() {
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [atividades, setAtividades] = useState([]);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      const resultado = await listarAtividadesSalvas();
      if (!ativo) return;

      if (resultado.sucesso) {
        setAtividades(resultado.data.map(normalizar));
      } else {
        setErro(resultado.mensagem);
      }
      setCarregando(false);
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, []);

  const handleRemover = (id) => async () => {
    setAtividades((atual) => atual.filter((atividade) => atividade.id !== id));
    await dessalvarAtividade(id);
  };

  return { carregando, erro, atividades, handleRemover };
}
