import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

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
        <Route
          path="/landingpage"
          element={
            <PageTransition>
              <TelaLandingPage />
            </PageTransition>
          }
        />
        <Route
          path="/"
          element={
            <PageTransition>
              <TelaDashboard />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PageTransition>
              <TelaDashboard />
            </PageTransition>
          }
        />
        <Route
          path="/perfil"
          element={
            <PageTransition>
              <TelaPerfil />
            </PageTransition>
          }
        />
        <Route
          path="/notificacoes"
          element={
            <PageTransition>
              <TelaNotificacoes />
            </PageTransition>
          }
        />
        <Route
          path="/conquistas"
          element={
            <PageTransition>
              <TelaConquistas />
            </PageTransition>
          }
        />
        <Route
          path="/dicionario"
          element={
            <PageTransition>
              <TelaDicionario />
            </PageTransition>
          }
        />
        <Route
          path="/loja"
          element={
            <PageTransition>
              <TelaLoja />
            </PageTransition>
          }
        />

        <Route
          path="/acompanhante"
          element={
            <PageTransition>
              <TelaAcompanhante />
            </PageTransition>
          }
        />
        <Route
          path="/atividades-salvas"
          element={
            <PageTransition>
              <TelaAtividadeSalva />
            </PageTransition>
          }
        />
        <Route
          path="/inicio-atividades"
          element={
            <PageTransition>
              <TelaInicioAtividades />
            </PageTransition>
          }
        />
        <Route
          path="/atividades-unidades"
          element={
            <PageTransition>
              <TelaInicioAtividadeUnidade />
            </PageTransition>
          }
        />
        <Route
          path="/teste-atividade"
          element={
            <PageTransition>
              <TelaAtividadeAlternativa />
            </PageTransition>
          }
        />
        <Route
          path="/atividade/fala/:id"
          element={
            <PageTransition>
              <TelaAtividadeFala />
            </PageTransition>
          }
        />
        <Route
          path="/atividade/acompanhante/:id"
          element={
            <PageTransition>
              <TelaAcompanhanteIA />
            </PageTransition>
          }
        />
        <Route
          path="/atividade/video/:id"
          element={
            <PageTransition>
              <TelaAtividadeVideo />
            </PageTransition>
          }
        />

        <Route
          path="/dashboard-medico"
          element={
            <PageTransition>
              <DashboardMedico />
            </PageTransition>
          }
        />
        <Route
          path="/contato-medico"
          element={
            <PageTransition>
              <TelaContatoMedico />
            </PageTransition>
          }
        />
        <Route
          path="/configuracoes-medico"
          element={
            <PageTransition>
              <TelaConfiguracoesMedico />
            </PageTransition>
          }
        />

        <Route
          path="/dashboard-admin"
          element={
            <PageTransition>
              <DashboardAdmin />
            </PageTransition>
          }
        />
        <Route
          path="/profissional-admin"
          element={
            <PageTransition>
              <ProfissionaisAdmin />
            </PageTransition>
          }
        />
        <Route
          path="/atividades-admin"
          element={
            <PageTransition>
              <TelaAtividadesAdmin />
            </PageTransition>
          }
        />

        <Route
          path="/cadastrar-paciente"
          element={
            <PageTransition>
              <CadastrarPaciente />
            </PageTransition>
          }
        />
        <Route
          path="/tela-paciente"
          element={
            <PageTransition>
              <TelaPaciente />
            </PageTransition>
          }
        />
        <Route
          path="/atividade-paciente/:id"
          element={
            <PageTransition>
              <TelaPacienteAtividade />
            </PageTransition>
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
