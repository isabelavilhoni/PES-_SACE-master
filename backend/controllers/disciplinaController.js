const db = require("../confing/database");

// 1. LISTAR (Atualizado para trazer o status 'ativo')
exports.listar = async (req, res) => {
  try {
    // Adicionado o campo 'ativo' no SELECT
    const sql =
      "SELECT id_disciplina, nome, carga_horaria, ativo FROM DISCIPLINA ORDER BY nome ASC";
    const [results] = await db.query(sql);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// 2. BUSCAR POR ID
exports.buscarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const sql =
      "SELECT id_disciplina, nome, carga_horaria, ativo FROM DISCIPLINA WHERE id_disciplina = ?";
    const [results] = await db.query(sql, [id]);
    res.json(results[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// 3. CADASTRAR (Garante que ela nasce Ativa por padrão = 1)
exports.cadastrar = async (req, res) => {
  try {
    const { nome, carga_horaria } = req.body;
    // O 1 no final força que toda nova disciplina comece como Ativa
    const sql =
      "INSERT INTO DISCIPLINA (nome, carga_horaria, ativo) VALUES (?, ?, 1)";
    const [result] = await db.query(sql, [nome, carga_horaria]);

    res.status(201).json({
      id: result.insertId,
      message: "Disciplina criada com sucesso!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// 4. ATUALIZAR
exports.atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, carga_horaria } = req.body;
    const sql =
      "UPDATE DISCIPLINA SET nome = ?, carga_horaria = ? WHERE id_disciplina = ?";

    await db.query(sql, [nome, carga_horaria, id]);
    res.json({ message: "Disciplina atualizada com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// 🔥 5. NOVA FUNÇÃO: ATUALIZAR STATUS (Liga/Desliga da chave do React)
exports.atualizarStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { ativo } = req.body; // Recebe 1 ou 0 do Frontend

    const sql = "UPDATE DISCIPLINA SET ativo = ? WHERE id_disciplina = ?";
    await db.query(sql, [ativo, id]);

    res.json({ message: "Status da disciplina atualizado com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// 6. EXCLUIR (Mantida caso precise usar no futuro)
exports.excluir = async (req, res) => {
  try {
    const { id } = req.params;

    // Trava: Verifica se a disciplina está em uso na tabela ALOCACAO
    const [vinculo] = await db.query(
      "SELECT * FROM ALOCACAO WHERE id_disciplina = ?",
      [id]
    );

    if (vinculo.length > 0) {
      return res.status(400).json({
        message:
          "Não é possível excluir: esta disciplina está sendo usada em uma Grade Curricular.",
      });
    }

    const sql = "DELETE FROM DISCIPLINA WHERE id_disciplina = ?";
    await db.query(sql, [id]);

    res.json({ message: "Disciplina excluída com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
