const express = require("express");
const router = express.Router();
const alocacaoController = require("../controllers/alocacaoController");

// Rotas para gerenciar a grade (vínculo professor/turma/disciplina)
router.get("/auxiliares", alocacaoController.getDadosAuxiliares);
router.get("/turma/:id_turma", alocacaoController.listarPorTurma);
router.post("/", alocacaoController.vincular);
router.delete("/:id", alocacaoController.desvincular);

// ESSA LINHA É OBRIGATÓRIA:
module.exports = router;