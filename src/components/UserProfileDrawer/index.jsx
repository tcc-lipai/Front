import { X, Bell, User } from "lucide-react";
import { useUserProfileDrawer } from "./index.hook";
import "./index.css";

const NIVEIS = {
  1: "Iniciante",
  2: "Básico",
  3: "Intermediário",
  4: "Avançado",
};

export const UserProfileDrawer = ({ isOpen, onClose }) => {
  const { usuario, carregando, handleEditProfileClick, handleNotificacao } =
    useUserProfileDrawer(onClose);

  const nome = usuario?.nome ?? usuario?.Nome ?? "";
  const email = usuario?.email ?? usuario?.Email ?? "";
  const diagnostico = usuario?.diagnostico ?? usuario?.Diagnostico ?? "";
  const nivel = usuario?.nivelDificuldade ?? usuario?.NivelDificuldade;
  const nivelLabel = typeof nivel === "string" ? nivel : (NIVEIS[nivel] ?? "—");
  const saldo = usuario?.saldoAtual ?? usuario?.SaldoAtual ?? 0;
  const diasSeguidos = usuario?.diasSeguidos ?? usuario?.DiasSeguidos ?? 0;

  return (
    <>
      {isOpen && <div className="drawer-overlay" onClick={onClose} />}

      <div className={`drawer-container ${isOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <button className="close-btn" onClick={onClose}>
            <X size={24} color="#8A6B8E" />
          </button>

          <button className="drawer-notification-btn" onClick={handleNotificacao}>
            <Bell size={20} color="white" fill="white" />
          </button>
        </div>

        <div className="drawer-profile-info">
          <div className="avatar-circle">
            <User size={48} color="white" />
          </div>
          <h2 className="username">{carregando ? "Carregando..." : nome || "Usuário"}</h2>
          <span className="user-email">{email}</span>
        </div>

        <div className="drawer-details">
          <p>
            <strong>Diagnóstico:</strong> {diagnostico || "Não informado"}
          </p>
          <p>
            <strong>Nível de dificuldade:</strong> {nivelLabel}
          </p>
          <p>
            <strong>Moedas:</strong> {saldo}
          </p>
          <p>
            <strong>Ofensiva:</strong> {diasSeguidos} dia(s) seguido(s)
          </p>
        </div>

        <button className="edit-profile-btn" onClick={handleEditProfileClick}>
          Editar Perfil
        </button>
      </div>
    </>
  );
};
