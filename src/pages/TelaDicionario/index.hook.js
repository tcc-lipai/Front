import { useEffect, useMemo, useState } from "react";
import { listarCategorias, listarPalavras } from "../../services/dicionarioService";
import { getCached, setCached } from "../../utils/apiCache";

const CHAVE_CACHE = "dicionario";

export function useTelaDicionario() {
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [palavras, setPalavras] = useState([]);
  const [categoriaAtiva, setCategoriaAtiva] = useState(null);
  const [drawerAberto, setDrawerAberto] = useState(false);
  const [palavraAberta, setPalavraAberta] = useState(null);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      const emCache = getCached(CHAVE_CACHE);
      const [categoriasRes, palavrasRes] = emCache ?? (await Promise.all([
        listarCategorias(),
        listarPalavras(),
      ]));
      if (!ativo) return;
      if (!emCache) setCached(CHAVE_CACHE, [categoriasRes, palavrasRes]);

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
  const abrirPalavra = (palavra) => setPalavraAberta(palavra);
  const fecharPalavra = () => setPalavraAberta(null);

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
    palavraAberta,
    abrirPalavra,
    fecharPalavra,
  };
}
