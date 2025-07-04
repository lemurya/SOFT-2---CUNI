const express = require('express');
const router = express.Router();
const {
  obtenerReportesPorUsuario,
  obtenerReportesPorTema
} = require('../controllers/reporteController');

router.get('/:userId', obtenerReportesPorUsuario);
router.get('/:userId/:tema', obtenerReportesPorTema);

module.exports = router;
