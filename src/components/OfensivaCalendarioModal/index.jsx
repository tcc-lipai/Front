import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Flame, Snowflake, X } from "lucide-react";
import { buscarHistoricoOfensiva } from "../../services/progressoService";
import "./index.css";

const DIAS_SEMANA = ["D", "S", "T", "Q", "Q", "S", "S"];

function zerarHora(data) {
  const d = new Date(data);
  d.setHours(0, 0, 0, 0);
  return d;
}

function chaveDia(data) {
  const d = zerarHora(data);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function diferencaEmDias(depois, antes) {
  const MS_POR_DIA = 1000 * 60 * 60 * 24;
  return Math.round((zerarHora(depois) - zerarHora(antes)) / MS_POR_DIA);
}

function gerarCelulasDoMes(mesReferencia) {
  const ano = mesReferencia.getFullYear();
  const mes = mesReferencia.getMonth();
  const primeiroDia = new Date(ano, mes, 1);
  const totalDias = new Date(ano, mes + 1, 0).getDate();

  const celulas = [];
  for (let i = 0; i < primeiroDia.getDay(); i++) celulas.push(null);
  for (let dia = 1; dia <= totalDias; dia++) celulas.push(new Date(ano, mes, dia));

  return celulas;
}

/**
 * Status "de verdade" vem do histórico gravado pela API (ofensiva/{usuarioId}).
 * A heurística abaixo só cobre os dias da sequência atual que ainda não têm
 * registro no histórico — caso de contas cuja ofensiva já vinha rodando antes
 * dessa tabela existir.
 */
function statusHeuristico(data, { diasSeguidos, ultimaAtividadeData, ofensivaCongeladaAte }) {
  const hoje = zerarHora(new Date());
  const d = zerarHora(data);
  const ultima = ultimaAtividadeData ? zerarHora(new Date(ultimaAtividadeData)) : null;
  const congeladaAte = ofensivaCongeladaAte ? zerarHora(new Date(ofensivaCongeladaAte)) : null;

  if (ultima && d <= ultima) {
    const distancia = diferencaEmDias(ultima, d);
    if (distancia < diasSeguidos) return "realizada";
  }

  if (congeladaAte && d > (ultima ?? hoje) && d <= congeladaAte) {
    return "congelada";
  }

  return "vazio";
}

function statusDoDia(data, historicoMap, contexto) {
  const hoje = zerarHora(new Date());
  const d = zerarHora(data);
  const isHoje = d.getTime() === hoje.getTime();

  if (d > hoje) return { status: "futuro", isHoje };

  const doHistorico = historicoMap.get(chaveDia(d));
  if (doHistorico === "Realizada") return { status: "realizada", isHoje };
  if (doHistorico === "Congelada") return { status: "congelada", isHoje };

  return { status: statusHeuristico(d, contexto), isHoje };
}

export function OfensivaCalendarioModal({
  isOpen,
  onClose,
  diasSeguidos = 0,
  ultimaAtividadeData,
  ofensivaCongeladaAte,
  usuarioId,
}) {
  const [mesReferencia, setMesReferencia] = useState(() => zerarHora(new Date()));
  const [historico, setHistorico] = useState([]);

  useEffect(() => {
    if (!isOpen || !usuarioId) return;

    let ativo = true;
    buscarHistoricoOfensiva(usuarioId).then((res) => {
      if (ativo && res.sucesso) setHistorico(res.data);
    });

    return () => {
      ativo = false;
    };
  }, [isOpen, usuarioId]);

  const historicoMap = useMemo(() => {
    const mapa = new Map();
    for (const item of historico) {
      const data = item.data ?? item.Data;
      const status = item.status ?? item.Status;
      if (data) mapa.set(chaveDia(new Date(data)), status);
    }
    return mapa;
  }, [historico]);

  const celulas = useMemo(() => gerarCelulasDoMes(mesReferencia), [mesReferencia]);
  const rotuloMes = mesReferencia
    .toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
    .replace(/^./, (c) => c.toUpperCase());

  if (!isOpen) return null;

  const irParaMesAnterior = () =>
    setMesReferencia((atual) => new Date(atual.getFullYear(), atual.getMonth() - 1, 1));
  const irParaProximoMes = () =>
    setMesReferencia((atual) => new Date(atual.getFullYear(), atual.getMonth() + 1, 1));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-ofensiva-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-x" onClick={onClose} aria-label="Fechar modal">
          <X size={22} />
        </button>

        <div className="ofensiva-modal-streak">
          <div className="ofensiva-modal-flame">
            <Flame size={26} strokeWidth={2.4} />
          </div>
          <div>
            <strong>{diasSeguidos}</strong>
            <span>{diasSeguidos === 1 ? "dia seguido" : "dias seguidos"}</span>
          </div>
        </div>

        <div className="ofensiva-cal-nav">
          <button type="button" onClick={irParaMesAnterior} aria-label="Mês anterior">
            <ChevronLeft size={20} />
          </button>
          <span>{rotuloMes}</span>
          <button type="button" onClick={irParaProximoMes} aria-label="Próximo mês">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="ofensiva-cal-grid ofensiva-cal-grid--cabecalho">
          {DIAS_SEMANA.map((letra, indice) => (
            <span key={indice}>{letra}</span>
          ))}
        </div>

        <div className="ofensiva-cal-grid">
          {celulas.map((data, indice) => {
            if (!data) return <span key={`vazio-${indice}`} />;

            const { status, isHoje } = statusDoDia(data, historicoMap, {
              diasSeguidos,
              ultimaAtividadeData,
              ofensivaCongeladaAte,
            });

            return (
              <span
                key={data.toISOString()}
                className={`ofensiva-cal-dia ofensiva-cal-dia--${status} ${
                  isHoje ? "ofensiva-cal-dia--hoje" : ""
                }`}
              >
                {status === "realizada" && <Flame size={12} />}
                {status === "congelada" && <Snowflake size={12} />}
                {data.getDate()}
              </span>
            );
          })}
        </div>

        <div className="ofensiva-cal-legenda">
          <span>
            <i className="ofensiva-legenda-dot ofensiva-legenda-dot--realizada" /> Realizada
          </span>
          <span>
            <i className="ofensiva-legenda-dot ofensiva-legenda-dot--congelada" /> Congelada
          </span>
          <span>
            <i className="ofensiva-legenda-dot ofensiva-legenda-dot--hoje" /> Hoje
          </span>
        </div>
      </div>
    </div>
  );
}

export default OfensivaCalendarioModal;
