import { useEffect, useState } from "react";
import { listarItensSalvos, dessalvarItem } from "../../services/atividadeService";

const DESCRICAO_POR_TIPO = {
  video: "Vídeo-aula de leitura labial.",
  alternativa: "Atividade de interpretação.",
  fala: "Exercício de pronúncia.",
  "fala-sessao": "Atividade de fala.",
};

function normalizar(item) {
  const tipoItem = item.tipoItem ?? item.TipoItem;
  return {
    id: `${tipoItem}-${item.itemId ?? item.ItemId}`,
    tipoItem,
    itemId: item.itemId ?? item.ItemId,
    titulo: item.titulo ?? item.Titulo ?? "Atividade",
    descricao: DESCRICAO_POR_TIPO[tipoItem] ?? "",
  };
}

export function useTelaAtividadeSalva() {
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [atividades, setAtividades] = useState([]);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      const resultado = await listarItensSalvos();
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

  const handleRemover = (tipoItem, itemId) => async () => {
    setAtividades((atual) => atual.filter((a) => !(a.tipoItem === tipoItem && a.itemId === itemId)));
    await dessalvarItem(tipoItem, itemId);
  };

  return { carregando, erro, atividades, handleRemover };
}
