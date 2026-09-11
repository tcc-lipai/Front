import { useEffect, useMemo, useState } from "react";
import { listarProdutos, comprarProduto } from "../../services/produtoService";
import { buscarUsuario } from "../../services/usuarioService";

const ICONE_POR_TIPO = {
  BloqueioOfensiva: "gelo",
  MultiplicadorMoedas: "moedas",
  Cosmetico: "bau",
};

function descricaoDoProduto(produto) {
  const tipo = produto.tipo ?? produto.Tipo;
  const dias = produto.duracaoDias ?? produto.DuracaoDias ?? 1;

  if (tipo === "BloqueioOfensiva") {
    return `Protege sua sequência de dias por ${dias} dia(s), mesmo se você faltar.`;
  }
  if (tipo === "MultiplicadorMoedas") {
    const multiplicador = produto.valorMultiplicador ?? produto.ValorMultiplicador ?? 2;
    return `Multiplica por ${multiplicador}x as moedas ganhas durante ${dias} dia(s).`;
  }
  return "Item especial para personalizar a sua experiência no LipAI.";
}

function normalizarProduto(produto) {
  const tipo = produto.tipo ?? produto.Tipo;
  return {
    id: produto.idProduto ?? produto.IdProduto,
    title: produto.nome ?? produto.Nome,
    description: descricaoDoProduto(produto),
    price: produto.preco ?? produto.Preco,
    tipo: ICONE_POR_TIPO[tipo] ?? "bau",
  };
}

export function useTelaLoja() {
  const [busca, setBusca] = useState("");
  const [drawerAberto, setDrawerAberto] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [tentativaCarga, setTentativaCarga] = useState(0);
  const [produtos, setProdutos] = useState([]);
  const [saldo, setSaldo] = useState(0);
  const [mensagem, setMensagem] = useState("");
  const [comprandoId, setComprandoId] = useState(null);

  const usuarioId = localStorage.getItem("id");

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      const [produtosRes, usuarioRes] = await Promise.all([
        listarProdutos(),
        buscarUsuario(usuarioId),
      ]);
      if (!ativo) return;

      setProdutos(produtosRes.sucesso ? produtosRes.data.map(normalizarProduto) : []);
      if (usuarioRes.sucesso) {
        setSaldo(usuarioRes.data.saldoAtual ?? usuarioRes.data.SaldoAtual ?? 0);
      }
      setCarregando(false);
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, [usuarioId, tentativaCarga]);

  const itensFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    const itens = produtos.map((item) => ({ ...item, isBlocked: item.price > saldo }));
    if (!termo) return itens;
    return itens.filter((item) => item.title.toLowerCase().includes(termo));
  }, [produtos, busca, saldo]);

  const abrirPerfil = () => setDrawerAberto(true);
  const fecharPerfil = () => setDrawerAberto(false);

  const handleComprar = async (item) => {
    setMensagem("");
    if (item.isBlocked) {
      setMensagem(`Você precisa de mais moedas para comprar "${item.title}".`);
      return;
    }

    setComprandoId(item.id);
    const resultado = await comprarProduto(item.id, 1);
    setComprandoId(null);

    if (resultado.sucesso) {
      setSaldo(resultado.data.novoSaldo ?? resultado.data.NovoSaldo ?? saldo - item.price);
      setMensagem(`"${item.title}" comprado com sucesso!`);
      setTentativaCarga((n) => n + 1);
    } else {
      setMensagem(resultado.mensagem);
    }
  };

  return {
    busca,
    setBusca,
    itensFiltrados,
    drawerAberto,
    abrirPerfil,
    fecharPerfil,
    handleComprar,
    carregando,
    saldo,
    mensagem,
    comprandoId,
  };
}
