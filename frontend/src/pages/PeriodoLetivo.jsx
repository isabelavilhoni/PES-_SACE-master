import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const PeriodoLetivo = () => {
  const [periodos, setPeriodos] = useState([]);
  const [busca, setBusca] = useState("");
  const navigate = useNavigate();

  const usuarioLogado = JSON.parse(localStorage.getItem("usuario")) || {};
  const ehCoordenacao = usuarioLogado?.perfil === "Coordenacao";

  useEffect(() => {
    carregarPeriodos();
  }, []);

  const carregarPeriodos = async () => {
    try {
      const res = await api.get("/periodo-letivo");
      setPeriodos(res.data);
    } catch (error) {
      console.error("Erro ao carregar períodos:", error);
    }
  };

  const handleAtivar = async (id) => {
    if (!window.confirm("Deseja definir este período como vigente?")) return;
    try {
      await api.put(`/periodo-letivo/ativar/${id}`);
      carregarPeriodos();
    } catch (error) {
      alert("Erro ao ativar período.");
    }
  };

  const handleEncerrar = async (id) => {
    if (
      !window.confirm(
        "Atenção: Encerrar este período bloqueará edições. Continuar?"
      )
    )
      return;
    try {
      await api.put(`/periodo-letivo/encerrar/${id}`);
      carregarPeriodos();
    } catch (error) {
      alert("Erro ao encerrar período.");
    }
  };

  const handleExcluir = async (id) => {
    if (
      !window.confirm(
        "ATENÇÃO: Excluir este período é irreversível. Continuar?"
      )
    )
      return;
    try {
      await api.delete(`/periodo-letivo/${id}`);
      carregarPeriodos();
    } catch (error) {
      alert(error.response?.data?.message || "Erro ao excluir.");
    }
  };

  const filtrados = periodos.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="page-body" style={{ padding: "20px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <div>
          <h1 style={{ marginBottom: "3px" }}>Períodos Letivos</h1>
          <p
            style={{
              margin: 0,
              fontSize: "18px",
              color: "#737373",
              fontWeight: "500",
            }}
          >
            Gerencie os ciclos e períodos do ano letivo.
          </p>
        </div>
        {ehCoordenacao && (
          <Link
            to="/periodos/novo"
            className="btn-new-discipline"
            style={{ textDecoration: "none" }}
          >
            + Novo Período
          </Link>
        )}
      </div>

      {/* Busca */}
      <div className="content-card" style={{ marginBottom: "20px" }}>
        {/* AQUI FOI ADICIONADO O TÍTULO E ÍCONE IGUAL AO DE DISCIPLINAS */}
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
            event_note
          </span>
          <span style={{ fontWeight: "900", fontSize: "22px", color: "#333" }}>
            Buscar período
          </span>
        </div>

        <div className="search-container" style={{ marginBottom: "10px" }}>
          <span className="material-symbols-outlined search-icon">search</span>
          <input
            type="text"
            className="search-input-large"
            placeholder="Buscar período por nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      {/* Tabela */}
      <div className="content-card">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Início</th>
              <th>Fim</th>
              <th>Status</th>
              <th style={{ textAlign: "center" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length > 0 ? (
              filtrados.map((p) => (
                <tr key={p.id_periodo}>
                  <td>{p.nome}</td>
                  <td>{new Date(p.data_inicio).toLocaleDateString()}</td>
                  <td>{new Date(p.data_fim).toLocaleDateString()}</td>
                  <td>
                    {p.ativo
                      ? "Vigente"
                      : p.status === "encerrado"
                      ? "Encerrado"
                      : "Pendente"}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    {ehCoordenacao && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: "10px",
                        }}
                      >
                        {!p.ativo && p.status !== "encerrado" && (
                          <>
                            <button
                              className="btn-icon"
                              onClick={() =>
                                navigate(`/periodos/editar/${p.id_periodo}`)
                              }
                              title="Editar"
                            >
                              <span
                                className="material-symbols-outlined"
                                style={{ color: "#0055ff" }}
                              >
                                edit
                              </span>
                            </button>
                            <button
                              className="btn-icon"
                              onClick={() => handleAtivar(p.id_periodo)}
                              title="Tornar Vigente"
                            >
                              <span
                                className="material-symbols-outlined"
                                style={{ color: "#2a9d8f" }}
                              >
                                check_circle
                              </span>
                            </button>
                            <button
                              className="btn-icon"
                              onClick={() => handleExcluir(p.id_periodo)}
                              title="Excluir"
                            >
                              <span
                                className="material-symbols-outlined"
                                style={{ color: "#d32f2f" }}
                              >
                                delete
                              </span>
                            </button>
                          </>
                        )}
                        {p.ativo === 1 && (
                          <button
                            className="btn-icon"
                            onClick={() => handleEncerrar(p.id_periodo)}
                            title="Encerrar Período"
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{ color: "#333" }}
                            >
                              block
                            </span>
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  Nenhum período encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PeriodoLetivo;
