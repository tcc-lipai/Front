import { useEffect, useMemo, useState } from "react";
import { listarCategorias, listarPalavras } from "../../services/dicionarioService";

export function useTelaDicionario() {
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [palavras, setPalavras] = useState([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState(null);
  const [drawerAberto, setDrawerAberto] = useState(false);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      const [categoriasRes, palavrasRes] = await Promise.all([
        listarCategorias(),
        listarPalavras(),
      ]);
      if (!ativo) return;

      if (categoriasRes.sucesso) {
        setCategorias(categoriasRes.data);
        const primeira = categoriasRes.data[0];
        if (primeira) {
          setCategoriaAtiva(primeira.idCategoria ?? primeira.IdCategoria);
        }
      } else {
        setErro(categoriasRes.mensagem);
      }

      if (palavrasRes.sucesso) setPalavras(palavrasRes.data);

      setCarregando(false);
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, []);

  const abrirPerfil = () => setDrawerAberto(true);
  const fecharPerfil = () => setDrawerAberto(false);

  const cardsFiltrados = useMemo(() => {
    if (categoriaAtiva == null) return palavras;
    return palavras.filter(
      (palavra) => (palavra.categoriaId ?? palavra.CategoriaId) === categoriaAtiva
    );
  }, [palavras, categoriaAtiva]);

  return {
    carregando,
    erro,
    categorias,
    categoriaAtiva,
    setCategoriaAtiva,
    cardsFiltrados,
    drawerAberto,
    abrirPerfil,
    fecharPerfil,
  };
}
