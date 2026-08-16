const express = require("express");
const router = express.Router();
const professorController = require("../controllers/professorController");

router.get("/", professorController.listar);
router.get("/:id", professorController.buscarPorId);
router.post("/", professorController.cadastrar);
router.put("/:id", professorController.atualizar);
router.put("/status/:id", professorController.atualizarStatus);
router.delete("/:id", professorController.excluir);

module.exports = router;