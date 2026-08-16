import React, { useState, useEffect } from "react";
import api from "../services/api";

const Inicio = () => {
  const [stats, setStats] = useState({
    totalAlunos: 0,
    totalProfessores: 0,
    totalTurmas: 0,
  });

  const usuarioLogado = JSON.parse(localStorage.getItem("usuario")) || {};

  useEffect(() => {
    const carregarStats = async () => {
      try {
        const response = await api.get("/dashboard/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Erro ao carregar estatísticas do dashboard");
      }
    };
    carregarStats();
  }, []);

  return (
    <div className="page-container">
      <div className="welcome-section">
        <h1 className="page-title">Olá, {usuarioLogado.login}!</h1>
        <p className="page-description">
          Bem-vindo ao <strong>SGE - Sistema de Gestão Escolar</strong>. Veja o
          que temos para hoje:
        </p>
      </div>

      <div className="dashboard-grid">
        {/* Card de Alunos */}
        <div className="stat-card">
          <div className="stat-icon icon-blue">
            <span className="material-symbols-outlined">group</span>
          </div>
          <div className="stat-info">
            <h3>{stats.totalAlunos}</h3>
            <p>Alunos Cadastrados</p>
          </div>
        </div>

        {/* Card de Professores */}
        <div className="stat-card">
          <div className="stat-icon icon-green">
            <span className="material-symbols-outlined">co_present</span>
          </div>
          <div className="stat-info">
            <h3>{stats.totalProfessores}</h3>
            <p>Professores Ativos</p>
          </div>
        </div>

        {/* Card de Turmas */}
        <div className="stat-card">
          <div className="stat-icon icon-orange">
            <span className="material-symbols-outlined">class</span>
          </div>
          <div className="stat-info">
            <h3>{stats.totalTurmas}</h3>
            <p>Turmas Formadas</p>
          </div>
        </div>
      </div>

      <div
        className="content-card"
        style={{ marginTop: "40px", padding: "30px", textAlign: "center" }}
      >
        <h2 style={{ color: "#002060", marginBottom: "10px" }}>
          Acesso Rápido
        </h2>
        <p style={{ color: "#666" }}>
          Utilize o menu lateral para gerenciar as informações da escola.
        </p>
      </div>
    </div>
  );
};

export default Inicio;
