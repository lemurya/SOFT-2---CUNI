const tiendaService = require('../services/TiendaService');

class TiendaController {
  async obtenerCatalogo(req, res) {
    try {
      const catalogo = await tiendaService.obtenerCatalogo();
      res.json(catalogo);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener el catálogo' });
    }
  }

  async obtenerItemsComprados(req, res) {
    const { usuarioId } = req.params;

    try {
      const items = await tiendaService.obtenerItemsComprados(usuarioId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al obtener los ítems comprados' });
    }
  }

  async comprarItem(req, res) {
    const { usuarioId, productoId } = req.body;

    if (!usuarioId || !productoId) {
      return res.status(400).json({ mensaje: 'Faltan datos para la compra' });
    }

    try {
      const resultado = await tiendaService.comprarItem(usuarioId, productoId);
      res.json({
        mensaje: 'Compra exitosa',
        item: resultado.item,
        monedas: resultado.monedasRestantes
      });
    } catch (error) {
      res.status(400).json(error);
    }
  }

  // ✅ NUEVO: activar ítem comprado
  async usarItem(req, res) {
    const { usuarioId, itemNombre } = req.body;

    if (!usuarioId || !itemNombre) {
      return res.status(400).json({ mensaje: 'Faltan datos para activar ítem' });
    }

    try {
      const resultado = await tiendaService.activarItem(usuarioId, itemNombre);
      res.json(resultado);
    } catch (error) {
      res.status(500).json(error);
    }
  }
}

module.exports = new TiendaController();
