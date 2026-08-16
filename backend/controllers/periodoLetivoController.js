const db = require("../confing/database");

exports.listar = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM PERIODOS_LETIVOS ORDER BY data_inicio DESC"
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
      "SELECT * FROM PERIODOS_LETIVOS WHERE id_periodo = ?",
      [id]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: "Período não encontrado." });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.cadastrar = async (req, res) => {
  try {
    const { nome, data_inicio, data_fim } = req.body;

    if (new Date(data_fim) <= new Date(data_inicio)) {
      return res.status(400).json({
        message: "A data final deve ser posterior à data inicial.",
      });
    }

    const [periodoExistente] = await db.query(
      "SELECT * FROM PERIODOS_LETIVOS WHERE nome = ?",
      [nome]
    );

    if (periodoExistente.length > 0) {
      return res.status(400).json({
        message: "Já existe um período letivo com esse nome.",
      });
    }

    await db.query(
      `INSERT INTO PERIODOS_LETIVOS
      (nome, data_inicio, data_fim, status, ativo)
      VALUES (?, ?, ?, 'Pendente', 0)`,
      [nome, data_inicio, data_fim]
    );

    res.status(201).json({
      message: "Período criado com sucesso!",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { nome, data_inicio, data_fim } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT status FROM PERIODOS_LETIVOS WHERE id_periodo = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Período não encontrado.",
      });
    }

    const [nomeExistente] = await db.query(
      `SELECT id_periodo
   FROM PERIODOS_LETIVOS
   WHERE nome = ?
   AND id_periodo <> ?`,
      [nome, id]
    );

    if (nomeExistente.length > 0) {
      return res.status(400).json({
        message: "Já existe um período letivo com esse nome.",
      });
    }

    if (new Date(data_fim) <= new Date(data_inicio)) {
      return res.status(400).json({
        message: "A data final deve ser posterior à data inicial.",
      });
    }

    if (rows[0].status !== "Pendente") {
      return res.status(400).json({
        message: "Somente períodos pendentes podem ser alterados.",
      });
    }

    await db.query(
      "UPDATE PERIODOS_LETIVOS SET nome = ?, data_inicio = ?, data_fim = ? WHERE id_periodo = ?",
      [nome, data_inicio, data_fim, id]
    );

    res.json({
      message: "Período atualizado!",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT status FROM PERIODOS_LETIVOS WHERE id_periodo = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Período não encontrado.",
      });
    }

    if (rows[0].status !== "Pendente") {
      return res.status(400).json({
        message: "Somente períodos pendentes podem ser excluídos.",
      });
    }
    await db.query("DELETE FROM PERIODOS_LETIVOS WHERE id_periodo = ?", [id]);
    res.json({ message: "Período excluído!" });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

exports.ativarPeriodo = async (req, res) => {
  const { id } = req.params;

  try {
    // Busca o período
    const [rows] = await db.query(
      "SELECT * FROM PERIODOS_LETIVOS WHERE id_periodo = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Período não encontrado.",
      });
    }

    const periodo = rows[0];
    if (periodo.status === "Vigente") {
      return res.status(400).json({
        message: "Este período já está vigente.",
      });
    }

    // Não permite ativar um período encerrado
    if (periodo.status === "Encerrado") {
      return res.status(400).json({
        message: "Períodos encerrados não podem ser ativados novamente.",
      });
    }

    // Todo período vigente volta para Pendente
    await db.query(`
      UPDATE PERIODOS_LETIVOS
      SET ativo = 0,
          status = 'Pendente'
      WHERE status = 'Vigente'
    `);

    // Ativa o período escolhido
    await db.query(
      `
      UPDATE PERIODOS_LETIVOS
      SET ativo = 1,
          status = 'Vigente'
      WHERE id_periodo = ?
    `,
      [id]
    );

    res.json({
      message: "Período ativado com sucesso!",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

exports.encerrar = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT status FROM PERIODOS_LETIVOS WHERE id_periodo = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Período não encontrado.",
      });
    }

    if (rows[0].status !== "Vigente") {
      return res.status(400).json({
        message: "Somente um período vigente pode ser encerrado.",
      });
    }

    await db.query(
      `UPDATE PERIODOS_LETIVOS
       SET ativo = 0,
           status = 'Encerrado'
       WHERE id_periodo = ?`,
      [id]
    );

    res.json({
      message: "Período encerrado com sucesso!",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
