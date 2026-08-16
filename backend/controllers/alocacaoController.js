const db = require("../confing/database");

const alocacaoController = {
  // 1. Busca os dados para preencher os Selects (Professores e Disciplinas)
  getDadosAuxiliares: async (req, res) => {
    try {
      // Buscando professores filtrando pelo ENUM 'Professor'
      const [professores] = await db.query(
        "SELECT id_usuario AS id_professor, nome_completo FROM usuario WHERE perfil = 'Professor' AND ativo = 1 ORDER BY nome_completo ASC"
      );

      // Buscando disciplinas (usando o nome da tabela em minúsculo, conforme seu SHOW TABLES)
      const [disciplinas] = await db.query(
        "SELECT id_disciplina, nome FROM disciplina ORDER BY nome ASC"
      );

      return res.status(200).json({ professores, disciplinas });
    } catch (error) {
      console.error("ERRO NO BACKEND:", error);
      return res
        .status(500)
        .json({ message: "Erro ao carregar dados auxiliares." });
    }
  },

  // 2. Lista a grade (professores/matérias) de uma turma específica
  listarPorTurma: async (req, res) => {
    try {
      const { id_turma } = req.params;
      // Correção: Tabela 'alocacao', 'disciplina' (minúsculas) e 'usuario' (P)
      const sql = `
        SELECT 
            A.id_alocacao, 
            P.nome_completo AS nome_professor, 
            D.nome AS nome_disciplina
        FROM alocacao A
        JOIN usuario P ON A.id_professor = P.id_usuario
        JOIN disciplina D ON A.id_disciplina = D.id_disciplina
        WHERE A.id_turma = ?
        ORDER BY D.nome ASC
      `;
      const [alocacoes] = await db.query(sql, [id_turma]);
      return res.status(200).json(alocacoes);
    } catch (error) {
      console.error("ERRO LISTAR POR TURMA:", error);
      return res
        .status(500)
        .json({ message: "Erro ao buscar grade da turma." });
    }
  },

  // 3. Cria o vínculo
  vincular: async (req, res) => {
    try {
      const { id_turma, id_professor, id_disciplina, ano_letivo } = req.body;

      // Correção: Tabela 'alocacao' (minúscula)
      const [existe] = await db.query(
        "SELECT * FROM alocacao WHERE id_turma = ? AND id_disciplina = ?",
        [id_turma, id_disciplina]
      );

      if (existe.length > 0) {
        return res.status(400).json({
          message:
            "Esta disciplina já possui um professor vinculado nesta turma.",
        });
      }

      // Correção: Tabela 'alocacao' (minúscula)
      const sql =
        "INSERT INTO alocacao (id_turma, id_professor, id_disciplina, ano_letivo) VALUES (?, ?, ?, ?)";
      await db.query(sql, [id_turma, id_professor, id_disciplina, ano_letivo]);

      return res
        .status(201)
        .json({ message: "Professor vinculado com sucesso!" });
    } catch (error) {
      console.error("ERRO VINCULAR:", error);
      return res.status(500).json({ message: "Erro ao vincular professor." });
    }
  },

  // 4. Remove um professor da grade da turma
  desvincular: async (req, res) => {
    try {
      const { id } = req.params;
      await db.query("DELETE FROM ALOCACAO WHERE id_alocacao = ?", [id]);
      return res.status(200).json({ message: "Vínculo removido com sucesso!" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao remover vínculo." });
    }
  },
};

module.exports = alocacaoController;
