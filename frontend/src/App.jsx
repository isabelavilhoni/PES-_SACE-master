import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Login from "./pages/Login";
import RecuperarSenha from "./pages/RecuperarSenha";
import Inicio from "./pages/Inicio";
import ListaAlunos from "./pages/ListaAlunos";
import Alunos from "./pages/Alunos";
import ListaTurmas from "./pages/ListaTurmas";
import FormTurma from "./pages/FormTurma";
import GradeTurma from "./pages/GradeTurma";
import ListaDisciplinas from "./pages/ListaDisciplinas";
import FormDisciplina from "./pages/FormDisciplina";
import ListaProfessores from "./pages/ListaProfessores";
import Professores from "./pages/Professores";
import PeriodoLetivo from "./pages/PeriodoLetivo";
import FormPeriodoLetivo from "./pages/FormPeriodoLetivo";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas (Sem o Layout/Menu lateral) */}
        <Route path="/" element={<Login />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />{" "}
        {/* <--- Rota adicionada */}
        {/* Rotas Protegidas (Com Layout/Menu lateral) */}
        <Route element={<Layout />}>
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/alunos" element={<ListaAlunos />} />
          <Route path="/alunos/novo" element={<Alunos />} />
          <Route path="/alunos/editar/:id" element={<Alunos />} />
          <Route path="/turmas" element={<ListaTurmas />} />
          <Route path="/turmas/nova" element={<FormTurma />} />
          <Route path="/turmas/editar/:id" element={<FormTurma />} />
          <Route path="/turmas/:id/grade" element={<GradeTurma />} />
          <Route path="/disciplinas" element={<ListaDisciplinas />} />
          <Route path="/disciplinas/nova" element={<FormDisciplina />} />
          <Route path="/disciplinas/editar/:id" element={<FormDisciplina />} />
          <Route path="/professores" element={<ListaProfessores />} />
          <Route path="/professores/novo" element={<Professores />} />
          <Route path="/professores/editar/:id" element={<Professores />} />
          <Route path="/periodos" element={<PeriodoLetivo />} />
          <Route path="/periodos/novo" element={<FormPeriodoLetivo />} />
          <Route path="/periodos/editar/:id" element={<FormPeriodoLetivo />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
