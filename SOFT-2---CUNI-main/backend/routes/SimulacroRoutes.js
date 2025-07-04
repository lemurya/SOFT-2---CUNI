const express = require('express');

const {
  iniciarSimulacro,
  obtenerTodas,
  responder,
  verResultados,
  reiniciar
}=require( '../controllers/simulacroController');

const router = express.Router();

router.post('/iniciar', iniciarSimulacro);
router.get('/:userId/todas', obtenerTodas);
router.post('/:userId/responder', responder);
router.get('/:userId/resultados', verResultados);


module.exports = router;