import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import RotaProtegida from "./RotaProtegida";

import TelaLoginUser from "../pages/TelaLoginUser";
import TelaCadastroUser from "../pages/TelaCadastroUser";
import TelaDashboard from "../pages/TelaDashboard";
import TelaPerfil from "../pages/TelaPerfil";
import TelaNotificacoes from "../pages/TelaNotificacoes";
import TelaConquistas from "../pages/TelaConquistas";
import TelaDicionario from "../pages/TelaDicionario";
import TelaLoja from "../pages/TelaLoja";
import TelaContato from "../pages/TelaContato";
import TelaAcompanhante from "../pages/TelaAcompanhante";
import TelaAtividadeSalva from "../pages/TelaAtividadeSalva";
import TelaInicioAtividades from "../pages/TelaInicioAtividades";
import TelaInicioAtividadeUnidade from "../pages/TelaInicioAtividadeUnidade";
import TelaAtividadeAlternativa from "../pages/TelaAtividadeAlternativa";
import TelaAtividadeFala from "../pages/TelaAtividadeFala";
import TelaAtividadeFalaSessao from "../pages/TelaAtividadeFalaSessao";
import TelaAtividadeVideo from "../pages/TelaAtividadeVideo";
import TelaAcompanhanteIA from "../pages/TelaAcompanhanteIA";
import TelaLandingPage from "../pages/TelaLandingPage";
import DashboardMedico from "../pages/Profissional/TelaDashboardMedico";
import CadastrarPaciente from "../pages/Admin/TelaPacienteCadastro";
import TelaPaciente from "../pages/Profissional/TelaPaciente";
import TelaPacienteAtividade from "../pages/Profissional/TelaPacienteAtividade";

import TelaConfiguracoesMedico from "../pages/Profissional/TelaConfiguracoesMedico";
import TelaContatoMedico from "../pages/Profissional/TelaContatoMedico";
import DashboardAdmin from "../pages/Admin/TelaDashboardAdmin";
import ProfissionaisAdmin from "../pages/Admin/TelaProfissionaisAdmin";
import TelaAtividadesAdmin from "../pages/Admin/TelaAtividadesAdmin";

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* ---- Rotas públicas: landing, login e cadastro ---- */}
        <Route
          path="/"
          element={
            <PageTransition>
              <TelaLandingPage />
            </PageTransition>
          }
        />
        <Route
          path="/landingpage"
          element={
            <PageTransition>
              <TelaLandingPage />
            </PageTransition>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransition>
              <TelaLoginUser />
            </PageTransition>
          }
        />
        <Route
          path="/criar-conta"
          element={
            <PageTransition>
              <TelaCadastroUser />
            </PageTransition>
          }
        />

        {/* ---- Rotas protegidas: só quem está logado entra ---- */}
        <Route
          path="/dashboard"
          element={
            <RotaProtegida>
              <PageTransition>
                <TelaDashboard />
              </PageTransition>
            </RotaProtegida>
          }
        />
        <Route
          path="/perfil"
          element={
            <RotaProtegida>
              <PageTransition>
                <TelaPerfil />
              </PageTransition>
            </RotaProtegida>
          }
        />
        <Route
          path="/contato"
          element={
            <RotaProtegida>
              <PageTransition>
                <TelaContato />
              </PageTransition>
            </RotaProtegida>
          }
        />
        <Route
          path="/notificacoes"
          element={
            <RotaProtegida>
              <PageTransition>
                <TelaNotificacoes />
              </PageTransition>
            </RotaProtegida>
          }
        />
        <Route
          path="/conquistas"
          element={
            <RotaProtegida>
              <PageTransition>
                <TelaConquistas />
              </PageTransition>
            </RotaProtegida>
          }
        />
        <Route
          path="/dicionario"
          element={
            <RotaProtegida>
              <PageTransition>
                <TelaDicionario />
              </PageTransition>
            </RotaProtegida>
          }
        />
        <Route
          path="/loja"
          element={
            <RotaProtegida>
              <PageTransition>
                <TelaLoja />
              </PageTransition>
            </RotaProtegida>
          }
        />

        <Route
          path="/acompanhante"
          element={
            <RotaProtegida>
              <PageTransition>
                <TelaAcompanhante />
              </PageTransition>
            </RotaProtegida>
          }
        />
        <Route
          path="/atividades-salvas"
          element={
            <RotaProtegida>
              <PageTransition>
                <TelaAtividadeSalva />
              </PageTransition>
            </RotaProtegida>
          }
        />
        <Route
          path="/inicio-atividades"
          element={
            <RotaProtegida>
              <PageTransition>
                <TelaInicioAtividades />
              </PageTransition>
            </RotaProtegida>
          }
        />
        <Route
          path="/atividades-unidades"
          element={
            <RotaProtegida>
              <PageTransition>
                <TelaInicioAtividadeUnidade />
              </PageTransition>
            </RotaProtegida>
          }
        />
        <Route
          path="/atividade/alternativa/:id"
          element={
            <RotaProtegida>
              <PageTransition>
                <TelaAtividadeAlternativa />
              </PageTransition>
            </RotaProtegida>
          }
        />
        <Route
          path="/atividade/fala/:id"
          element={
            <RotaProtegida>
              <PageTransition>
                <TelaAtividadeFala />
              </PageTransition>
            </RotaProtegida>
          }
        />
        <Route
          path="/atividade/fala-sessao/:id"
          element={
            <RotaProtegida>
              <PageTransition>
                <TelaAtividadeFalaSessao />
              </PageTransition>
            </RotaProtegida>
          }
        />
        <Route
          path="/atividade/acompanhante/:id"
          element={
            <RotaProtegida>
              <PageTransition>
                <TelaAcompanhanteIA />
              </PageTransition>
            </RotaProtegida>
          }
        />
        <Route
          path="/atividade/video/:id"
          element={
            <RotaProtegida>
              <PageTransition>
                <TelaAtividadeVideo />
              </PageTransition>
            </RotaProtegida>
          }
        />

        <Route
          path="/dashboard-medico"
          element={
            <RotaProtegida>
              <PageTransition>
                <DashboardMedico />
              </PageTransition>
            </RotaProtegida>
          }
        />
        <Route
          path="/contato-medico"
          element={
            <RotaProtegida>
              <PageTransition>
                <TelaContatoMedico />
              </PageTransition>
            </RotaProtegida>
          }
        />
        <Route
          path="/configuracoes-medico"
          element={
            <RotaProtegida>
              <PageTransition>
                <TelaConfiguracoesMedico />
              </PageTransition>
            </RotaProtegida>
          }
        />

        <Route
          path="/dashboard-admin"
          element={
            <RotaProtegida>
              <PageTransition>
                <DashboardAdmin />
              </PageTransition>
            </RotaProtegida>
          }
        />
        <Route
          path="/profissional-admin"
          element={
            <RotaProtegida>
              <PageTransition>
                <ProfissionaisAdmin />
              </PageTransition>
            </RotaProtegida>
          }
        />
        <Route
          path="/atividades-admin"
          element={
            <RotaProtegida>
              <PageTransition>
                <TelaAtividadesAdmin />
              </PageTransition>
            </RotaProtegida>
          }
        />

        <Route
          path="/cadastrar-paciente"
          element={
            <RotaProtegida>
              <PageTransition>
                <CadastrarPaciente />
              </PageTransition>
            </RotaProtegida>
          }
        />
        <Route
          path="/tela-paciente"
          element={
            <RotaProtegida>
              <PageTransition>
                <TelaPaciente />
              </PageTransition>
            </RotaProtegida>
          }
        />
        <Route
          path="/atividade-paciente/:id"
          element={
            <RotaProtegida>
              <PageTransition>
                <TelaPacienteAtividade />
              </PageTransition>
            </RotaProtegida>
          }
        />

        <Route
          path="*"
          element={
            <PageTransition>
              <h1>Página não encontrada</h1>
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default AppRoutes;
