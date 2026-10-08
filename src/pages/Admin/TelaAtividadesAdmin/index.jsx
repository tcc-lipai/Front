import Navbar, { NAV_ITENS_ADMIN } from "../../../components/Navbar";
import Botao from "../../../components/Botao";
import FormModal from "../../../components/FormModal";
import ModalDeletarItem from "../../../components/ModalDeletarItem";
import "../../../components/PainelListaUsuarios/index.css";
import { useTelaAtividadesAdmin } from "./index.hook";

const TelaAtividadesAdmin = () => {
  const h = useTelaAtividadesAdmin();

  const campos = [
    { name: "nome", label: "Nome da unidade", required: true, placeholder: "Ex.: Unidade 1 - Fonema A" },
    {
      name: "atividadeId",
      label: "Trilha (atividade)",
      required: true,
      options: h.atividades.map((a) => ({ valor: a.idAtividade, label: a.nome })),
    },
  ];

  const valoresIniciais = h.unidadeEditando
    ? { nome: h.unidadeEditando.nome, atividadeId: h.unidadeEditando.atividadeId }
    : { nome: "", atividadeId: "" };

  return (
    <div className="lista-usuarios">
      <aside className="lista-usuarios__sidebar">
        <Navbar itens={NAV_ITENS_ADMIN} />
      </aside>

      <main className="lista-usuarios__main">
        <header className="lista-usuarios__header">
          <h1 className="lista-usuarios__titulo">Atividades</h1>
        </header>

        <div className="lista-usuarios__container">
          {h.erro && <p className="lista-usuarios__vazio">{h.erro}</p>}
          {h.carregando && <p className="lista-usuarios__vazio">Carregando...</p>}

          {!h.carregando && (
            <ul className="lista-usuarios__lista">
              {h.unidades.map((u) => (
                <li key={u.idUnidade} className="lista-usuarios__item">
                  <div className="card-usuario">
                    <div className="card-usuario__info">
                      <h3 className="card-usuario__nome">{u.nome}</h3>
                      <p className="card-usuario__descricao">
                        {u.atividadesFala?.length ?? 0} atividade(s) de fala · {u.licoesVideo?.length ?? 0} vídeo(s) ·{" "}
                        {u.licoesAlternativa?.length ?? 0} alternativa(s)
                      </p>
                    </div>
                    <div className="card-usuario__acoes">
                      <Botao texto="Abrir" variante="primario" onClick={() => h.abrirUnidade(u)} />
                      <Botao texto="Editar" variante="secundario" onClick={() => h.abrirEdicao(u)} />
                      <Botao texto="Excluir" variante="perigo" onClick={() => h.setUnidadeParaExcluir(u)} />
                    </div>
                  </div>
                </li>
              ))}
              {h.unidades.length === 0 && <p className="lista-usuarios__vazio">Nenhuma unidade cadastrada.</p>}
            </ul>
          )}

          <div className="lista-usuarios__rodape">
            <Botao texto="Nova unidade" onClick={h.abrirNova} />
          </div>
        </div>
      </main>

      <FormModal
        key={h.unidadeEditando?.idUnidade ?? "nova"}
        isOpen={h.formAberto}
        titulo={h.unidadeEditando ? "Editar unidade" : "Nova unidade"}
        campos={campos}
        valoresIniciais={valoresIniciais}
        onSalvar={h.salvarUnidade}
        onFechar={h.fecharForm}
      />

      <ModalDeletarItem
        isOpen={!!h.unidadeParaExcluir}
        onClose={() => h.setUnidadeParaExcluir(null)}
        onConfirm={h.confirmarExclusao}
      />
    </div>
  );
};

export default TelaAtividadesAdmin;
