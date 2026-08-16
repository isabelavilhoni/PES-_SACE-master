const express = require("express");
const router = express.Router();
const disciplinaController = require("../controllers/disciplinaController");

// 1. LISTAR
router.get("/", disciplinaController.listar);

// 2. BUSCAR POR ID
router.get("/:id", disciplinaController.buscarPorId);

// 3. CADASTRAR
router.post("/", disciplinaController.cadastrar);

// 4. ATUALIZAR DADOS (Nome e Carga Horária)
router.put("/:id", disciplinaController.atualizar);

// 🔥 5. NOVA ROTA: ATUALIZAR STATUS (Ativo/Inativo para o Toggle Switch)
router.put("/:id/status", disciplinaController.atualizarStatus);

// 6. EXCLUIR
router.delete("/:id", disciplinaController.excluir);

module.exports = router;
