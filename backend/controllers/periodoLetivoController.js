const db = require("../confing/database");

exports.listar = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM periodos_letivos ORDER BY data_inicio DESC"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.buscarPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT * FROM periodos_letivos WHERE id_periodo = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Período não encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.criar = async (req, res) => {
  const { nome, ano_letivo, data_inicio, data_fim, ativo } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO periodos_letivos (nome, ano_letivo, data_inicio, data_fim, ativo) VALUES (?, ?, ?, ?, ?)",
      [nome, ano_letivo, data_inicio, data_fim, ativo || 0]
    );
    res.status(201).json({ id_periodo: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};