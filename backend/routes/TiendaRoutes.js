const express = require('express');
const router = express.Router();
const TiendaController = require('../controllers/TiendaController');

// Rutas para la tienda
router.get('/catalogo', TiendaController.obtenerCatalogo);
router.get('/mis-items/:usuarioId', TiendaController.obtenerItemsComprados);
router.post('/comprar', TiendaController.comprarItem);
router.post('/usar-item', TiendaController.usarItem); // ✅ ESTA

module.exports = router;
