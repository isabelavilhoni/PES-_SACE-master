const express = require("express");
const cors = require("cors");
const disciplinaRoutes = require("./routes/disciplinaRoutes");
const professorRoutes = require("./routes/professorRoutes");
const alunoRoutes = require("./routes/alunoRoutes");
const authRoutes = require("./routes/authRoutes");
const turmaRoutes = require("./routes/turmaRoutes");
const alocacaoRoutes = require("./routes/alocacaoRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const periodoLetivoRoutes = require("./routes/periodoLetivoRoutes");
const app = express();

app.use(cors());
app.use(express.json());

// Registro das Rotas
app.use("/api/disciplinas", disciplinaRoutes);
app.use("/api/professores", professorRoutes);
app.use("/api/alunos", alunoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/turmas", turmaRoutes);
app.use("/api/alocacoes", alocacaoRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/periodo-letivo", periodoLetivoRoutes);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});
