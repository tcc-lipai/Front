// InfoAtividades.jsx
// Card de atividade reutilizável (ex: "Primeira Atividade").
// Ainda sem integração com back-end: todos os dados vêm via props,
// com valores padrão para facilitar o uso em telas de protótipo.
// A barra de progresso é sempre exibida (default progresso={0}).
//
// NOVO (modoAdmin): quando modoAdmin={true}, o card troca o botão de
// "salvar" (bookmark) e o de "avançar" (chevron) pelos botões
// "Editar" e "Excluir", usando o componente <Botao />. Esse é o único
// efeito do modoAdmin — o restante (título, descrição, badges,
// progresso) continua idêntico. Como o valor padrão é modoAdmin=false,
// nenhuma tela que já usa o componente é afetada.
//
// Uso básico (telas normais, sem alteração):
//   <InfoAtividade
//     titulo="Primeira Atividade"
//     descricao="Teste seus conhecimentos de leitura labial através de uma ferramenta de IA..."
//     dificuldade="Iniciante"
//     tipo="Escrita"
//     progresso={65}
//   />
//
// Uso na tela de Admin:
//   <InfoAtividade
//     modoAdmin
//     titulo="Primeira Atividade"
//     descricao="..."
//     dificuldade="Iniciante"
//     tipo="Escrita"
//     progresso={65}
//     onEditar={() => ...}
//     onExcluir={() => ...}
//   />

import { PenTool, Bookmark, ChevronRight } from "lucide-react";
import { useInfoAtividade } from "./InfoAtividades.hook";
import {
  DIFICULDADES,
  normalizarDificuldade,
  truncarDescricao,
} from "./InfoAtividades.utils";
// Ajuste o caminho de importação abaixo conforme a localização real
// do componente Botao no seu projeto (ex: "../Botao" ou "../Botao/Botao").
import Botao from "../Botao";
import "./InfoAtividades.css";

export default function InfoAtividade({
  titulo = "Primeira Atividade",
  descricao = "Teste seus conhecimentos de leitura labial através de uma ferramenta de IA. Responda as perguntas e melhore suas habilidades de leitura labial!",
  dificuldade = DIFICULDADES.INICIANTE,
  tipo = "Escrita",
  progresso = 20,
  salva = false,
  limiteDescricao = 140,
  modoAdmin = false,
  onAvancar,
  onToggleSalvar,
  onEditar,
  onExcluir,
}) {
  const {
    salva: salvaAtual,
    progressoSeguro,
    handleToggleBookmark,
    handleAvancar,
    handleEditar,
    handleExcluir,
  } = useInfoAtividade({
    progresso,
    salvaInicial: salva,
    onAvancar,
    onToggleSalvar,
    onEditar,
    onExcluir,
  });

  const dificuldadeFormatada = normalizarDificuldade(dificuldade);
  const descricaoFormatada = truncarDescricao(descricao, limiteDescricao);

  return (
    <article
      className={`info-atividade ${modoAdmin ? "info-atividade--admin" : ""}`}
    >
      {!modoAdmin && (
        <button
          type="button"
          className={`info-atividade__bookmark ${
            salvaAtual ? "info-atividade__bookmark--ativo" : ""
          }`}
          onClick={handleToggleBookmark}
          aria-pressed={salvaAtual}
          aria-label={salvaAtual ? "Remover dos salvos" : "Salvar atividade"}
        >
          <Bookmark />
        </button>
      )}

      <div className="info-atividade__icone" aria-hidden="true">
        <PenTool />
      </div>

      <div className="info-atividade__conteudo">
        <h3 className="info-atividade__titulo">{titulo}</h3>
        <p className="info-atividade__descricao">{descricaoFormatada}</p>

        <div className="info-atividade__badges">
          <span className="info-atividade__badge info-atividade__badge--dificuldade">
            {dificuldadeFormatada}
          </span>
          <span className="info-atividade__badge info-atividade__badge--tipo">
            {tipo}
          </span>
        </div>

        <div className="info-atividade__progresso-wrapper">
          <div
            className="info-atividade__progresso-trilha"
            role="progressbar"
            aria-valuenow={progressoSeguro}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="info-atividade__progresso-preenchido"
              style={{ width: `${progressoSeguro}%` }}
            />
          </div>
        </div>
      </div>

      {modoAdmin ? (
        <div className="info-atividade__acoes-admin">
          <Botao
            texto="Editar"
            corDeFundo="#9B4FCE"
            corTexto="#FFFFFF"
            onClick={handleEditar}
            className="info-atividade__botao-admin"
          />
          <Botao
            texto="Excluir"
            corDeFundo="#E15A4F"
            corTexto="#FFFFFF"
            onClick={handleExcluir}
            className="info-atividade__botao-admin"
          />
        </div>
      ) : (
        <button
          type="button"
          className="info-atividade__avancar"
          onClick={handleAvancar}
          aria-label={`Abrir atividade ${titulo}`}
        >
          <ChevronRight />
        </button>
      )}
    </article>
  );
}