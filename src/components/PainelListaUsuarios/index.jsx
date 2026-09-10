import { Search, ChevronDown } from "lucide-react";
import Navbar from "../Navbar";
import { HeaderActions } from "../HeaderActions";
import CardUsuario from "../CardUsuario";
import DropdownFiltro from "../DropdownFiltro";
import { usePainelListaUsuarios } from "./index.hook";
import "./index.css";

/**
 * Tela de listagem de usuários (pacientes / profissionais) usada pelo admin
 * e pelo profissional. Antes eram 3 páginas com ~90% de código igual.
 *
 * @param {string}   titulo
 * @param {object[]}  itensNav          itens da Navbar (NAV_ITENS_*)
 * @param {object[]}  usuarios          { id, nome, descricao, nivel, status }
 * @param {string}    tipoCard          "paciente-admin" | "paciente-profissional"
 * @param {boolean}   mostrarHeaderActions
 * @param {(usuario) => void} aoEditar
 * @param {(usuario) => void} aoExcluir
 * @param {(usuario) => void} aoVer
 * @param {React.ReactNode}   rodape     ação extra no rodapé (ex: botão Cadastrar)
 */
const PainelListaUsuarios = ({
  titulo,
  itensNav,
  usuarios,
  tipoCard = "paciente-admin",
  mostrarHeaderActions = false,
  aoEditar,
  aoExcluir,
  aoVer,
  rodape = null,
}) => {
  const {
    pesquisa,
    setPesquisa,
    nivel,
    setNivel,
    consistencia,
    setConsistencia,
    usuariosFiltrados,
    NIVEIS,
    CONSISTENCIAS,
  } = usePainelListaUsuarios(usuarios);

  return (
    <div className="lista-usuarios">
      <aside className="lista-usuarios__sidebar">
        <Navbar itens={itensNav} />
      </aside>

      <main className="lista-usuarios__main">
        <header className="lista-usuarios__header">
          <h1 className="lista-usuarios__titulo">{titulo}</h1>
          {mostrarHeaderActions && <HeaderActions onOpenProfile={() => {}} />}
        </header>

        <div className="lista-usuarios__container">
          <div className="lista-usuarios__controles">
            <div className="lista-usuarios__pesquisa">
              <input
                type="text"
                placeholder="Pesquise"
                value={pesquisa}
                onChange={(evento) => setPesquisa(evento.target.value)}
                className="lista-usuarios__input"
                aria-label={`Pesquisar em ${titulo}`}
              />
              <Search size={18} className="lista-usuarios__lupa" />
            </div>

            <div className="lista-usuarios__filtros">
              <DropdownFiltro
                rotulo="Nível"
                valor={nivel}
                opcoes={NIVEIS}
                aoSelecionar={setNivel}
              />
              <DropdownFiltro
                rotulo="Consistência"
                valor={consistencia}
                opcoes={CONSISTENCIAS}
                aoSelecionar={setConsistencia}
              />
            </div>
          </div>

          <ul className="lista-usuarios__lista">
            {usuariosFiltrados.map((usuario) => (
              <li key={usuario.id} className="lista-usuarios__item">
                <CardUsuario
                  tipo={tipoCard}
                  nome={usuario.nome}
                  descricao={usuario.descricao}
                  nivel={usuario.nivel}
                  status={usuario.status}
                  onEditar={aoEditar ? () => aoEditar(usuario) : undefined}
                  onExcluir={aoExcluir ? () => aoExcluir(usuario) : undefined}
                  onVer={aoVer ? () => aoVer(usuario) : undefined}
                />
              </li>
            ))}

            {usuariosFiltrados.length === 0 && (
              <p className="lista-usuarios__vazio">Nenhum resultado encontrado.</p>
            )}
          </ul>

          <div className="lista-usuarios__rodape">
            <button type="button" className="lista-usuarios__ver-mais">
              Ver mais <ChevronDown size={16} />
            </button>
            {rodape}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PainelListaUsuarios;
