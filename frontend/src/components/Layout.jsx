import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

// IMPORTAÇÃO DA LOGO EM PNG
import logoEscola from "../assets/logo-escola.png";

function Layout() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));

  const menuItems = [
    {
      name: "Início",
      icon: "home",
      path: "/inicio",
      perfis: ["Coordenacao", "Secretaria", "Professor"],
    },
    {
      name: "Alunos",
      icon: "group",
      path: "/alunos",
      perfis: ["Coordenacao", "Secretaria", "Professor"],
    },
    {
      name: "Professores",
      icon: "co_present",
      path: "/professores",
      perfis: ["Coordenacao"],
    },
    {
      name: "Turmas",
      icon: "class",
      path: "/turmas",
      perfis: ["Coordenacao", "Secretaria", "Professor"],
    },
    {
      name: "Disciplinas",
      icon: "menu_book",
      path: "/disciplinas",
      perfis: ["Coordenacao", "Secretaria", "Professor"],
    },
    {
      name: "Período letivo",
      icon: "event_note",
      path: "/periodos",
      perfis: ["Coordenacao", "Secretaria"],
    },
    {
      name: "Matriculas",
      icon: "how_to_reg",
      path: "/matricula",
      perfis: ["Secretaria", "Professor"],
    },
    {
      name: "Notas",
      icon: "edit_note",
      path: "/notas",
      perfis: ["Professor", "Coordenacao"],
    },
    {
      name: "Frequência",
      icon: "event_available",
      path: "/frequencia",
      perfis: ["Professor", "Coordenacao"],
    },
    {
      name: "Boletim",
      icon: "receipt_long",
      path: "/boletim",
      perfis: ["Professor", "Secretaria", "Coordenacao"],
    },
    {
      name: "Configuração",
      icon: "settings",
      path: "/configuracao",
      perfis: ["Coordenacao"],
    },
  ];

  // Filtro com validação de segurança para evitar crashes indesejados
  const menusPermitidos = menuItems.filter((item) => {
    if (!usuarioLogado || !usuarioLogado.perfil) return false;
    return (
      Array.isArray(item.perfis) && item.perfis.includes(usuarioLogado.perfil)
    );
  });

  const handleLogout = () => {
    if (window.confirm("Deseja realmente sair?")) {
      localStorage.removeItem("usuario");
      navigate("/");
    }
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <img src={logoEscola} alt="Logo" className="logo-img" />
          <div className="logo-text">
            <span className="logo-line-1">SISTEMA DE APOIO</span>
            <span className="logo-line-2">AO CONTROLE ESCOLAR</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menusPermitidos.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <div className="user-menu-container">
            <div
              className="user-menu-trigger"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="material-symbols-outlined">account_circle</span>
              <span>{usuarioLogado?.login}</span>
              <span className="material-symbols-outlined seta">
                {isMenuOpen ? "expand_less" : "expand_more"}
              </span>
            </div>

            {isMenuOpen && (
              <div className="user-menu-dropdown">
                <button className="btn-logout-item" onClick={handleLogout}>
                  <span className="material-symbols-outlined">logout</span> Sair
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="page-body">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;
