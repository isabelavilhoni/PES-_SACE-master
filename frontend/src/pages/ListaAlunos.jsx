import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

const ListaAlunos = () => {
  const [alunos, setAlunos] = useState([]);
  const [busca, setBusca] = useState("");
  const usuarioLogado = JSON.parse(localStorage.getItem("usuario")) || {};

  // Verifica se o usuário é Secretaria
  const ehSecretaria = usuarioLogado?.perfil === "Secretaria";

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const response = await api.get("/alunos");
        setAlunos(response.data);
      } catch (error) {
        console.error("Erro ao buscar alunos:", error);
        alert("Erro ao carregar a lista de alunos.");
      }
    };
    buscarDados();
  }, []);

  const deletarAluno = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este aluno?")) {
      try {
        await api.delete(`/alunos/${id}`);
        setAlunos(alunos.filter((aluno) => aluno.id_aluno !== id));
      } catch (error) {
        console.error("Erro ao excluir:", error);
        alert("Erro ao excluir o aluno.");
      }
    }
  };

  const alunosFiltrados = alunos
    .filter(
      (aluno) =>
        (aluno.nome_completo || "")
          .toLowerCase()
          .includes(busca.toLowerCase()) ||
        (aluno.matricula || "").includes(busca)
    )
    .sort((a, b) => a.nome_completo.localeCompare(b.nome_completo));

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
          <h1 style={{ marginBottom: "3px" }}>Alunos</h1>
          <p
            style={{
              margin: 0,
              fontSize: "18px",
              color: "#737373",
              fontWeight: "500",
            }}
          >
            Gerencie o cadastro de alunos da escola.
          </p>
        </div>
        {ehSecretaria && (
          <Link
            to="/alunos/novo"
            className="btn-save"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              padding: "13px 24px",
              borderRadius: "8px",
              fontSize: "18px",
              fontWeight: "700",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "24px", verticalAlign: "middle" }}
            >
              add
            </span>
            Novo Aluno
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
            group
          </span>
          <span style={{ fontWeight: "900", fontSize: "22px", color: "#333" }}>
            Buscar aluno
          </span>
        </div>

        <div className="search-container" style={{ marginBottom: "25px" }}>
          <span className="material-symbols-outlined search-icon">search</span>
          <input
            type="text"
            className="search-input-large"
            placeholder="Buscar aluno por nome ou matrícula..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Matrícula</th>
              <th>Nome do Aluno</th>
              <th>CPF</th>
              <th>Telefone</th>
              {ehSecretaria && <th style={{ textAlign: "center" }}>Ações</th>}
            </tr>
          </thead>
          <tbody>
            {alunosFiltrados.length > 0 ? (
              alunosFiltrados.map((aluno) => (
                <tr key={aluno.id_aluno}>
                  <td>{aluno.matricula}</td>
                  <td style={{ fontWeight: "600" }}>{aluno.nome_completo}</td>
                  <td>{aluno.cpf}</td>
                  <td>{aluno.telefone}</td>
                  {ehSecretaria && (
                    <td style={{ textAlign: "center" }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "15px",
                        }}
                      >
                        <Link
                          to={`/alunos/editar/${aluno.id_aluno}`}
                          title="Editar"
                          style={{ color: "#0055ff", display: "flex" }}
                        >
                          <span className="material-symbols-outlined">
                            edit
                          </span>
                        </Link>
                        <button
                          onClick={() => deletarAluno(aluno.id_aluno)}
                          title="Excluir"
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#d32f2f",
                            display: "flex",
                          }}
                        >
                          <span className="material-symbols-outlined">
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={ehSecretaria ? "5" : "4"}
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#777",
                  }}
                >
                  Nenhum aluno encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListaAlunos;
