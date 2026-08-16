const express = require("express");
const router = express.Router();
const turmaController = require("../controllers/turmaController");

router.get("/", turmaController.index);
router.get("/:id", turmaController.show);
router.post("/", turmaController.store);
router.put("/:id", turmaController.update);

// CORREÇÃO: Remova o prefixo "/turmas" daqui, pois o router
// já está dentro desse contexto.
router.put("/:id/status", turmaController.updateStatus);

router.delete("/:id", turmaController.delete);

module.exports = router;
