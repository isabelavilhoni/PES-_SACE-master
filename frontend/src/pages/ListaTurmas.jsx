import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const ListaTurmas = () => {
  const [turmas, setTurmas] = useState([]);
  const [busca, setBusca] = useState("");
  const usuarioLogado = JSON.parse(localStorage.getItem("usuario")) || {};

  // Define o controle de permissão
  const ehCoordenacao = usuarioLogado?.perfil === "Coordenacao";

  const carregarTurmas = async () => {
    try {
      const response = await api.get("/turmas");
      setTurmas(response.data);
    } catch (error) {
      console.error("Erro ao buscar turmas:", error);
    }
  };

  useEffect(() => {
    carregarTurmas();
  }, []);

  const handleToggleStatus = async (id, statusAtual) => {
    const mensagem =
      statusAtual === 1
        ? "Você tem certeza que deseja deixar esta turma inativa?"
        : "Você deseja ativar o status desta turma?";

    if (!window.confirm(mensagem)) return;

    try {
      const novoStatus = statusAtual === 1 ? 0 : 1;
      await api.put(`/turmas/${id}/status`, { ativo: novoStatus });
      setTurmas((prev) =>
        prev.map((t) => (t.id_turma === id ? { ...t, ativo: novoStatus } : t))
      );
    } catch (error) {
      alert("Erro ao alterar o status da turma.");
    }
  };

  const filtradas = turmas.filter((t) =>
    (t.nome_turma || "").toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="page-body" style={{ padding: "20px" }}>
      <div
        className="filter-title"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div>
          <h1 style={{ marginBottom: "3px" }}>Turmas</h1>
          <p
            style={{
              margin: 0,
              fontSize: "18px",
              color: "#737373",
              fontWeight: "500",
            }}
          >
            Gerencie as turmas e vincule os professores.
          </p>
        </div>

        {/* Botão de Nova Turma apenas para Coordenação */}
        {ehCoordenacao && (
          <Link
            to="/turmas/nova"
            className="btn-save"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "13px 24px",
              borderRadius: "8px",
              fontSize: "18px",
              fontWeight: "700",
              textDecoration: "none",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "25px" }}
            >
              add
            </span>{" "}
            Nova Turma
          </Link>
        )}
      </div>

      <div className="content-card">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "15px",
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "35px", color: "#04225c" }}
          >
            class
          </span>
          <span style={{ fontWeight: "900", fontSize: "22px", color: "#333" }}>
            Buscar turma
          </span>
        </div>

        <div className="search-container" style={{ marginBottom: "25px" }}>
          <span className="material-symbols-outlined search-icon">search</span>
          <input
            type="text"
            className="search-input-large"
            placeholder="Buscar turma por nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th style={{ width: "80px" }}>N°</th>
              <th>Nome da Turma</th>
              <th>Ano Letivo</th>
              <th style={{ width: "120px" }}>Status</th>
              {/* Coluna de Ações apenas para Coordenação */}
              {ehCoordenacao && (
                <th style={{ width: "200px", textAlign: "center" }}>Ações</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filtradas.map((t, index) => {
              const isInativa = t.ativo !== 1;
              return (
                <tr
                  key={t.id_turma}
                  style={{
                    opacity: isInativa ? 0.5 : 1,
                    backgroundColor: isInativa ? "#fdfdfd" : "transparent",
                  }}
                >
                  <td>{String(index + 1).padStart(2, "0")}</td>
                  <td>
                    <strong>{t.nome_turma}</strong>
                  </td>
                  <td>{t.ano_letivo}</td>
                  <td>
                    <span
                      style={{
                        fontWeight: "400",
                        color: !isInativa ? "#2a9d8f" : "#d32f2f",
                      }}
                    >
                      {!isInativa ? "Ativo" : "Inativo"}
                    </span>
                  </td>

                  {/* Botões de Ação apenas para Coordenação */}
                  {ehCoordenacao && (
                    <td style={{ textAlign: "center" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: "25px",
                        }}
                      >
                        <Link
                          to={`/turmas/${t.id_turma}/grade`}
                          title="Grade"
                          style={{
                            color: "#04225c",
                            textDecoration: "none",
                            display: "flex",
                          }}
                        >
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: "35px" }}
                          >
                            assignment_ind
                          </span>
                        </Link>
                        <Link
                          to={`/turmas/editar/${t.id_turma}`}
                          title="Editar"
                          style={{
                            color: "#0055ff",
                            textDecoration: "none",
                            display: "flex",
                          }}
                        >
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: "35px" }}
                          >
                            edit
                          </span>
                        </Link>
                        <button
                          onClick={() =>
                            handleToggleStatus(t.id_turma, t.ativo)
                          }
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: !isInativa ? "#d32f2f" : "#2a9d8f",
                          }}
                        >
                          <span
                            className="material-symbols-outlined"
                            style={{ fontSize: "35px" }}
                          >
                            {!isInativa ? "block" : "check_circle"}
                          </span>
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListaTurmas;
