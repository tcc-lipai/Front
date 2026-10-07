import { useState } from "react";
import Navbar, { NAV_ITENS_ADMIN } from "../../../components/Navbar";
import Botao from "../../../components/Botao";
import FormModal from "../../../components/FormModal";
import ModalDeletarItem from "../../../components/ModalDeletarItem";
import { NIVEIS_DIFICULDADE, valorNivelDificuldade, nomeNivelDificuldade } from "../../../services/usuarioService";
import "../../../components/PainelListaUsuarios/index.css";
import { useTelaUnidadeAdmin, TIPOS } from "./index.hook";

const OPCOES_NIVEL = NIVEIS_DIFICULDADE.map((n) => ({ valor: n.valor, label: n.label }));
const OPCOES_RESPOSTA = ["a", "b", "c", "d"].map((l) => ({ valor: l, label: l.toUpperCase() }));

function camposDoForm(tipo, atividadesFala) {
  if (tipo === "video") {
    return [
      { name: "titulo", label: "Título", required: true },
      { name: "videoDescricao", label: "Descrição", textarea: true },
      { name: "videoUrl", label: "URL do vídeo", required: true },
    ];
  }
  if (tipo === "alternativa") {
    return [
      { name: "pergunta", label: "Pergunta", required: true, textarea: true },
      { name: "a", label: "Opção A", required: true },
      { name: "b", label: "Opção B", required: true },
      { name: "c", label: "Opção C", required: true },
      { name: "d", label: "Opção D", required: true },
      { name: "respostaCerta", label: "Resposta certa", required: true, options: OPCOES_RESPOSTA },
      { name: "videoUrl", label: "URL do vídeo (opcional)" },
      { name: "valorGanho", label: "Moedas ao acertar", type: "number" },
    ];
  }
  if (tipo === "fala") {
    return [
      { name: "fraseEsperada", label: "Frase", required: true },
      { name: "nivelDificuldade", label: "Nível", required: true, options: OPCOES_NIVEL },
      { name: "valorGanho", label: "Moedas ao acertar", type: "number" },
      {
        name: "atividadeFalaId",
        label: "Atividade de fala",
        options: atividadesFala.map((a) => ({ valor: a.idAtividadeFala, label: a.nome })),
      },
    ];
  }
  return [
    { name: "nome", label: "Nome da atividade de fala", required: true },
    { name: "nivelDificuldade", label: "Nível", required: true, options: OPCOES_NIVEL },
  ];
}

function valoresIniciais(tipo, item, grupoId) {
  if (!item) {
    if (tipo === "fala") return { nivelDificuldade: "", valorGanho: 0, atividadeFalaId: grupoId ?? "" };
    if (tipo === "alternativa") return { valorGanho: 0 };
    return {};
  }
  const nivel = String(valorNivelDificuldade(item.nivelDificuldade) ?? "");
  if (tipo === "video") return { titulo: item.titulo, videoDescricao: item.videoDescricao, videoUrl: item.videoUrl };
  if (tipo === "alternativa") {
    return {
      pergunta: item.pergunta, a: item.a, b: item.b, c: item.c, d: item.d,
      respostaCerta: item.respostaCerta, videoUrl: item.videoUrl, valorGanho: item.valorGanho,
    };
  }
  if (tipo === "fala") {
    return {
      fraseEsperada: item.fraseEsperada, nivelDificuldade: nivel, valorGanho: item.valorGanho,
      atividadeFalaId: item.atividadeFalaId ?? grupoId ?? "",
    };
  }
  return { nome: item.nome, nivelDificuldade: nivel };
}

const TITULOS = {
  video: "vídeo",
  alternativa: "alternativa",
  fala: "exercício de fala",
  atividadeFala: "atividade de fala",
};

const TelaUnidadeAdmin = () => {
  const h = useTelaUnidadeAdmin();
  const [abertos, setAbertos] = useState({});

  if (h.carregando) return <p className="lista-usuarios__vazio">Carregando...</p>;
  if (h.erro && !h.unidade) return <p className="lista-usuarios__vazio">{h.erro}</p>;

  const u = h.unidade;
  const grupos = u.atividadesFala ?? [];
  const exercicioSemGrupo = (u.licoesFala ?? []).filter((l) => !l.atividadeFalaId);

  const { form } = h;
  const tipoForm = form?.tipo;

  return (
    <div className="lista-usuarios">
      <aside className="lista-usuarios__sidebar">
        <Navbar itens={NAV_ITENS_ADMIN} />
      </aside>

      <main className="lista-usuarios__main">
        <header className="lista-usuarios__header" style={{ justifyContent: "flex-start", gap: 16 }}>
          <Botao texto="Voltar" variante="secundario" onClick={h.voltar} />
          <h1 className="lista-usuarios__titulo">{u.nome}</h1>
        </header>

        {h.erro && <p className="lista-usuarios__vazio">{h.erro}</p>}

        <section className="lista-usuarios__container">
          <div className="lista-usuarios__controles">
            <h2 style={{ margin: 0, color: "var(--lipai-text)" }}>Vídeos</h2>
            <Botao texto="Novo vídeo" onClick={() => h.abrirForm("video")} />
          </div>
          <ul className="lista-usuarios__lista">
            {(u.licoesVideo ?? []).map((v) => (
              <li key={v.idLicaoVideo} className="card-usuario">
                <div className="card-usuario__info">
                  <h3 className="card-usuario__nome">{v.titulo}</h3>
                  <p className="card-usuario__descricao">{v.videoUrl}</p>
                </div>
                <div className="card-usuario__acoes">
                  <Botao texto="Editar" variante="secundario" onClick={() => h.abrirForm("video", v)} />
                  <Botao texto="Excluir" variante="perigo" onClick={() => h.pedirExclusao("video", v)} />
                </div>
              </li>
            ))}
            {(u.licoesVideo ?? []).length === 0 && <p className="lista-usuarios__vazio">Nenhum vídeo.</p>}
          </ul>
        </section>

        <section className="lista-usuarios__container">
          <div className="lista-usuarios__controles">
            <h2 style={{ margin: 0, color: "var(--lipai-text)" }}>Alternativas</h2>
            <Botao texto="Nova alternativa" onClick={() => h.abrirForm("alternativa")} />
          </div>
          <ul className="lista-usuarios__lista">
            {(u.licoesAlternativa ?? []).map((a) => (
              <li key={a.idLicaoAlternativa} className="card-usuario">
                <div className="card-usuario__info">
                  <h3 className="card-usuario__nome">{a.pergunta}</h3>
                  <p className="card-usuario__descricao">
                    Resposta: {String(a.respostaCerta).toUpperCase()} · {a.valorGanho} moedas
                  </p>
                </div>
                <div className="card-usuario__acoes">
                  <Botao texto="Editar" variante="secundario" onClick={() => h.abrirForm("alternativa", a)} />
                  <Botao texto="Excluir" variante="perigo" onClick={() => h.pedirExclusao("alternativa", a)} />
                </div>
              </li>
            ))}
            {(u.licoesAlternativa ?? []).length === 0 && <p className="lista-usuarios__vazio">Nenhuma alternativa.</p>}
          </ul>
        </section>

        <section className="lista-usuarios__container">
          <div className="lista-usuarios__controles">
            <h2 style={{ margin: 0, color: "var(--lipai-text)" }}>Atividades de fala</h2>
            <Botao texto="Nova atividade de fala" onClick={() => h.abrirForm("atividadeFala")} />
          </div>

          {grupos.map((g) => {
            const aberto = abertos[g.idAtividadeFala];
            return (
              <div key={g.idAtividadeFala} className="card-usuario" style={{ flexDirection: "column", alignItems: "stretch" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <div className="card-usuario__info">
                    <h3 className="card-usuario__nome">{g.nome}</h3>
                    <p className="card-usuario__descricao">
                      {nomeNivelDificuldade(g.nivelDificuldade)} · {(g.exercicios ?? []).length} exercício(s)
                    </p>
                  </div>
                  <div className="card-usuario__acoes">
                    <Botao
                      texto={aberto ? "Fechar" : "Exercícios"}
                      variante="secundario"
                      onClick={() => setAbertos((s) => ({ ...s, [g.idAtividadeFala]: !aberto }))}
                    />
                    <Botao texto="Editar" variante="secundario" onClick={() => h.abrirForm("atividadeFala", g)} />
                    <Botao texto="Excluir" variante="perigo" onClick={() => h.pedirExclusao("atividadeFala", g)} />
                  </div>
                </div>

                {aberto && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
                    {(g.exercicios ?? []).map((e) => (
                      <div key={e.idLicaoFala} className="card-usuario" style={{ background: "var(--lipai-surface-2)" }}>
                        <div className="card-usuario__info">
                          <h3 className="card-usuario__nome">{e.fraseEsperada}</h3>
                          <p className="card-usuario__descricao">
                            {nomeNivelDificuldade(e.nivelDificuldade)} · {e.valorGanho} moedas
                          </p>
                        </div>
                        <div className="card-usuario__acoes">
                          <Botao texto="Editar" variante="secundario" onClick={() => h.abrirForm("fala", e, g.idAtividadeFala)} />
                          <Botao texto="Excluir" variante="perigo" onClick={() => h.pedirExclusao("fala", e)} />
                        </div>
                      </div>
                    ))}
                    <div>
                      <Botao texto="Novo exercício" onClick={() => h.abrirForm("fala", null, g.idAtividadeFala)} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {exercicioSemGrupo.length > 0 && (
            <p className="lista-usuarios__vazio">
              {exercicioSemGrupo.length} exercício(s) de fala sem atividade (edite um para vincular a uma atividade).
            </p>
          )}
          {grupos.length === 0 && <p className="lista-usuarios__vazio">Nenhuma atividade de fala.</p>}
        </section>
      </main>

      <FormModal
        key={`${tipoForm ?? "none"}-${form?.item?.[TIPOS[tipoForm]?.id] ?? "novo"}-${form?.grupoId ?? ""}`}
        isOpen={!!form}
        titulo={form ? `${form.item ? "Editar" : "Novo"} ${TITULOS[tipoForm]}` : ""}
        campos={form ? camposDoForm(tipoForm, grupos) : []}
        valoresIniciais={form ? valoresIniciais(tipoForm, form.item, form.grupoId) : {}}
        onSalvar={h.salvar}
        onFechar={h.fecharForm}
      />

      <ModalDeletarItem
        isOpen={!!h.paraExcluir}
        onClose={h.cancelarExclusao}
        onConfirm={h.confirmarExclusao}
      />
    </div>
  );
};

export default TelaUnidadeAdmin;
