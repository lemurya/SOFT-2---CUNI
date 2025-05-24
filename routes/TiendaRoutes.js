const express = require('express');
const router = express.Router();
const tiendaController = require('../controllers/TiendaController');

// GET /api/tienda/catalogo → lista de productos disponibles
router.get('/catalogo', tiendaController.obtenerCatalogo);

// GET /api/tienda/mis-items/:usuarioId → ítems comprados por un usuario
router.get('/mis-items/:usuarioId', tiendaController.obtenerItemsComprados);

// POST /api/tienda/comprar → comprar un ítem
router.post('/comprar', tiendaController.comprarItem);

module.exports = router;
