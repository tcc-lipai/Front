import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import RotaProtegida from "./RotaProtegida";

const TelaLoginUser = lazy(() => import("../pages/TelaLoginUser"));
const TelaCadastroUser = lazy(() => import("../pages/TelaCadastroUser"));
const TelaDashboard = lazy(() => import("../pages/TelaDashboard"));
const TelaPerfil = lazy(() => import("../pages/TelaPerfil"));
const TelaNotificacoes = lazy(() => import("../pages/TelaNotificacoes"));
const TelaConquistas = lazy(() => import("../pages/TelaConquistas"));
const TelaDicionario = lazy(() => import("../pages/TelaDicionario"));
const TelaLoja = lazy(() => import("../pages/TelaLoja"));
const TelaContato = lazy(() => import("../pages/TelaContato"));
const TelaAcompanhante = lazy(() => import("../pages/TelaAcompanhante"));
const TelaAtividadeSalva = lazy(() => import("../pages/TelaAtividadeSalva"));
const TelaInicioAtividades = lazy(() => import("../pages/TelaInicioAtividades"));
const TelaInicioAtividadeUnidade = lazy(() => import("../pages/TelaInicioAtividadeUnidade"));
const TelaAtividadeAlternativa = lazy(() => import("../pages/TelaAtividadeAlternativa"));
const TelaAtividadeFala = lazy(() => import("../pages/TelaAtividadeFala"));
const TelaAtividadeFalaSessao = lazy(() => import("../pages/TelaAtividadeFalaSessao"));
const TelaAtividadeVideo = lazy(() => import("../pages/TelaAtividadeVideo"));
const TelaAcompanhanteIA = lazy(() => import("../pages/TelaAcompanhanteIA"));
const TelaLandingPage = lazy(() => import("../pages/TelaLandingPage"));
const DashboardMedico = lazy(() => import("../pages/Profissional/TelaDashboardMedico"));
const CadastrarPaciente = lazy(() => import("../pages/Admin/TelaPacienteCadastro"));
const TelaProfissionalCadastro = lazy(() => import("../pages/Admin/TelaProfissionalCadastro"));
const TelaPaciente = lazy(() => import("../pages/Profissional/TelaPaciente"));
const TelaPacienteAtividade = lazy(() => import("../pages/Profissional/TelaPacienteAtividade"));

const TelaConfiguracoesMedico = lazy(() => import("../pages/Profissional/TelaConfiguracoesMedico"));
const TelaContatoMedico = lazy(() => import("../pages/Profissional/TelaContatoMedico"));
const DashboardAdmin = lazy(() => import("../pages/Admin/TelaDashboardAdmin"));
const ProfissionaisAdmin = lazy(() => import("../pages/Admin/TelaProfissionaisAdmin"));
const TelaAtividadesAdmin = lazy(() => import("../pages/Admin/TelaAtividadesAdmin"));
const TelaUnidadeAdmin = lazy(() => import("../pages/Admin/TelaUnidadeAdmin"));
const TelaConfiguracoesAdmin = lazy(() => import("../pages/Admin/TelaConfiguracoesAdmin"));

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
            <RotaProtegida papeis={["Profissional"]}>
              <PageTransition>
                <DashboardMedico />
              </PageTransition>
            </RotaProtegida>
          }
        />
        <Route
          path="/contato-medico"
          element={
            <RotaProtegida papeis={["Profissional"]}>
              <PageTransition>
                <TelaContatoMedico />
              </PageTransition>
            </RotaProtegida>
          }
        />
        <Route
          path="/configuracoes-medico"
          element={
            <RotaProtegida papeis={["Profissional"]}>
              <PageTransition>
                <TelaConfiguracoesMedico />
              </PageTransition>
            </RotaProtegida>
          }
        />

        <Route
          path="/dashboard-admin"
          element={
            <RotaProtegida papeis={["Admin"]}>
              <PageTransition>
                <DashboardAdmin />
              </PageTransition>
            </RotaProtegida>
          }
        />
        <Route
          path="/profissional-admin"
          element={
            <RotaProtegida papeis={["Admin"]}>
              <PageTransition>
                <ProfissionaisAdmin />
              </PageTransition>
            </RotaProtegida>
          }
        />
        <Route
          path="/atividades-admin"
          element={
            <RotaProtegida papeis={["Admin"]}>
              <PageTransition>
                <TelaAtividadesAdmin />
              </PageTransition>
            </RotaProtegida>
          }
        />

        <Route
          path="/atividades-admin/:id"
          element={
            <RotaProtegida papeis={["Admin"]}>
              <PageTransition>
                <TelaUnidadeAdmin />
              </PageTransition>
            </RotaProtegida>
          }
        />

        <Route
          path="/configuracoes-admin"
          element={
            <RotaProtegida papeis={["Admin"]}>
              <PageTransition>
                <TelaConfiguracoesAdmin />
              </PageTransition>
            </RotaProtegida>
          }
        />

        <Route
          path="/cadastrar-paciente"
          element={
            <RotaProtegida papeis={["Admin"]}>
              <PageTransition>
                <CadastrarPaciente />
              </PageTransition>
            </RotaProtegida>
          }
        />
        <Route
          path="/cadastrar-profissional"
          element={
            <RotaProtegida papeis={["Admin"]}>
              <PageTransition>
                <TelaProfissionalCadastro />
              </PageTransition>
            </RotaProtegida>
          }
        />
        <Route
          path="/editar-profissional/:id"
          element={
            <RotaProtegida papeis={["Admin"]}>
              <PageTransition>
                <TelaProfissionalCadastro />
              </PageTransition>
            </RotaProtegida>
          }
        />

        <Route
          path="/editar-paciente/:id"
          element={
            <RotaProtegida papeis={["Admin"]}>
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
      {/* cada tela é um chunk separado (lazy): fallback vazio enquanto baixa */}
      <Suspense fallback={null}>
        <AnimatedRoutes />
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRoutes;
