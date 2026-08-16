const db = require("../confing/database");

const dashboardController = {
  getStats: async (req, res) => {
    try {
      // 1. Executa a contagem de alunos
      const [alunos] = await db.query("SELECT COUNT(*) as total FROM ALUNO");

      // 2. Prepara e EXECUTA a query de professores buscando na tabela USUARIO
      const sqlProfessores =
        "SELECT COUNT(*) as total FROM USUARIO WHERE perfil = 'Professor' AND ativo = 1"; // <--- ADICIONEI O AND ativo = 1
      const [professores] = await db.query(sqlProfessores);

      // 3. Executa a contagem de turmas
      const [turmas] = await db.query("SELECT COUNT(*) as total FROM TURMA");

      // 4. Retorna os dados redondinhos para o frontend
      return res.status(200).json({
        totalAlunos: alunos[0].total,
        totalProfessores: professores[0].total,
        totalTurmas: turmas[0].total,
      });
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error);
      return res.status(500).json({ message: "Erro ao carregar dashboard." });
    }
  },
};

module.exports = dashboardController;
