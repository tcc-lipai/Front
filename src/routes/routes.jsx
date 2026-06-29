import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TelaLoginUser from '../pages/TelaLoginUser';
import TelaCadastroUser from '../pages/TelaCadastroUser';
import TelaPerguntas from '../pages/TelaPerguntas';
import TelaDashboard from '../pages/TelaDashboard';
import TelaPerfil from '../pages/TelaPerfil';
import TelaConfiguracoes from '../pages/TelaConfiguracoes';
import TelaNotificacoes from '../pages/TelaNotificacoes';
import TelaConquistas from '../pages/TelaConquistas';
import TelaDicionario from '../pages/TelaDicionario';
import TelaLoja from '../pages/TelaLoja';
import TelaContato from '../pages/TelaContato';
import TelaAcompanhante from '../pages/TelaAcompanhante';
import TelaAtividadeSalva from '../pages/TelaAtividadeSalva';
import TelaInicioAtividades from '../pages/TelaInicioAtividades';
import TelaInicioAtividadeUnidade from '../pages/TelaInicioAtividadeUnidade';
import TelaAtividadeAlternativa from '../pages/TelaAtividadeAlternativa';
import TelaAtividadeConcluida from '../pages/TelaAtividadeConcluida';
import TelaAtividadeFala from '../pages/TelaAtividadeFala';
import TelaAtividadeVideo from '../pages/TelaAtividadeVideo';
import TelaAcompanhanteIA from '../pages/TelaAcompanhanteIA';
import TelaLandingPage from '../pages/TelaLandingPage';
import DashboardMedico from '../pages/Profissional/TelaDashboardMedico';
<<<<<<< HEAD
import CadastrarPaciente from '../pages/Admin/TelaPacienteCadastro';
import TelaPaciente from '../pages/Profissional/TelaPaciente';
import TelaPacienteAtividade from '../pages/Profissional/TelaPacienteAtividade';


import DashboardAdmin from '../pages/Admin/TelaDashboardAdmin';
=======
import TelaProfissionaisAdmin from '../pages/Admin/TelaProfissionaisAdmin';
>>>>>>> 1277820 (feat: adiciona rota da tela)



function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<TelaLoginUser />} />
        <Route path="/criar-conta" element={<TelaCadastroUser />} />
        <Route path="/pergunta-inicial" element={<TelaPerguntas />} />
        <Route path="/landingpage" element={<TelaLandingPage />} />

        <Route path="/" element={<TelaDashboard />} />
        <Route path="/perfil" element={<TelaPerfil />} />
        <Route path="/configuracoes" element={<TelaConfiguracoes />} />
        <Route path="/notificacoes" element={<TelaNotificacoes />} />
        <Route path="/conquistas" element={<TelaConquistas />} />
        <Route path="/dicionario" element={<TelaDicionario />} />
        <Route path="/loja" element={<TelaLoja />} />
        <Route path="/contato" element={<TelaContato />} />

        <Route path="/acompanhante" element={<TelaAcompanhante />} />
        <Route path="/atividades-salvas" element={<TelaAtividadeSalva />} />
        <Route path="/inicio-atividades" element={<TelaInicioAtividades />} />
        <Route path="/atividades-unidades" element={<TelaInicioAtividadeUnidade />} />
        <Route path="/teste-atividade" element={<TelaAtividadeAlternativa />} />
        <Route path="/atividade/fala/:id" element={<TelaAtividadeFala />} />
        <Route path="/atividade/acompanhante/:id" element={<TelaAcompanhanteIA />} />
        <Route path="/atividade/video/:id" element={<TelaAtividadeVideo />} />

        <Route path="/dashboard-medico" element={<DashboardMedico />} />
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />

<<<<<<< HEAD
        <Route path="/cadastrar-paciente" element={<CadastrarPaciente />} />
        <Route path="/tela-paciente" element={<TelaPaciente />} />        
        <Route path="/atividade-paciente/:id" element={<TelaPacienteAtividade />} />

=======
>>>>>>> 1277820 (feat: adiciona rota da tela)
        <Route path="*" element={<h1>Página não encontrada</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;