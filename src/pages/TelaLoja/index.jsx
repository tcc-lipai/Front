import React from "react";
import { Search } from "lucide-react";
import Navbar from "../../components/Navbar";
import { HeaderActions } from "../../components/infoEstrelas";
import { UserProfileDrawer } from "../../components/UserProfileDrawer";
import ProdutoLoja from "../../components/Produto-loja";
import { useTelaLoja } from "./index.hook";

// 1. Importe a imagem da personagem aqui (ajuste o caminho se necessário)
import ImgPersonagem from "../../assets/img/menina-carrinho.png"; 

import "./index.css";

const TelaLoja = () => {
  const {
    busca,
    setBusca,
    itensFiltrados,
    drawerAberto,
    abrirPerfil,
    fecharPerfil,
  } = useTelaLoja();

  return (
    <div className="tela-loja">
      <Navbar /> 

      <main className="tela-loja__conteudo">
        <div className="tela-loja__topo">
          <HeaderActions onOpenProfile={abrirPerfil} />
        </div>

        {/* Painel Principal */}
        <section className="tela-loja__painel">
          
          {/* LADO ESQUERDO: Textos, Busca e Grid */}
          <div className="tela-loja__painel-esquerda">
            <h1 className="tela-loja__titulo">Loja</h1>
            <p className="tela-loja__descricao">
              Faça suas compras aqui e desbloqueie vantagens para acelerar o seu aprendizado.
            </p>

            <div className="tela-loja__busca">
              <input
                type="text"
                placeholder="Pesquise"
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
                aria-label="Pesquisar item na loja"
              />
              <Search size={18} />
            </div>

            <div className="tela-loja__grid">
              {itensFiltrados.map((item) => (
                <div className="tela-loja__grid-item" key={item.id}>
                  <ProdutoLoja
                    title={item.title}
                    description={item.description}
                    price={item.price}
                    tipo={item.tipo} // Usando "tipo" como combinamos antes
                    isBlocked={item.isBlocked}
                  />
                </div>
              ))}
            </div>

            {itensFiltrados.length === 0 && (
              <p className="tela-loja__vazio">
                Nenhum item encontrado para “{busca}”.
              </p>
            )}
          </div>

          {/* LADO DIREITO: Ilustração */}
          <div className="tela-loja__painel-direita">
            <img 
              src={ImgPersonagem} 
              alt="Personagem com carrinho de compras" 
              className="tela-loja__ilustracao" 
            />
          </div>

        </section>
      </main>

      <UserProfileDrawer isOpen={drawerAberto} onClose={fecharPerfil} />
    </div>
  );
};

export default TelaLoja;