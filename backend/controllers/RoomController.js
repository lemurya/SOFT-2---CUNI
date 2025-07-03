const RoomManager = require('../managers/RoomManager');
const SillaDecorator = require('../decorators/SillaDecorator');
const MesaDecorator = require('../decorators/MesaDecorator');
const ItemDecorator = require('../decorators/ItemDecorator');

const db = require('../database/db');

const decoradores = {
  silla: SillaDecorator,
  mesa: MesaDecorator,
  default: ItemDecorator
};

const getRoomItems = async (req, res) => {
  const usuarioId = req.query.usuario_id;
  if (!usuarioId) return res.status(400).json({ error: 'usuario_id requerido' });

  try {
    const room = await RoomManager.getRoom(usuarioId);
    res.json({ items: room.getItems(), descripcion: room.getDescription() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al cargar habitación' });
  }
};

const addRoomItem = async (req, res) => {
  let { usuario_id, tipo, datos } = req.body;
  if (!usuario_id || !tipo || !datos) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  // Normalizar tipo
  const tipoLimpio = tipo.trim().toLowerCase();

  // Reforzar consistencia del imageUrl
  const datosLimpios = {
    ...datos,
    imageUrl: tipoLimpio,
  };

  const Decorador = decoradores[tipoLimpio] || decoradores.default;

  try {
    await RoomManager.equipItem(usuario_id, tipoLimpio, datosLimpios);
    const room = await RoomManager.getRoom(usuario_id);
    res.status(201).json({ mensaje: 'Ítem agregado', items: room.getItems() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar ítem en la habitación' });
  }
};

const resetRoom = async (req, res) => {
  const usuarioId = req.query.usuario_id;
  if (!usuarioId) return res.status(400).json({ error: 'usuario_id requerido' });

  try {
    await RoomManager.resetRoom(usuarioId);
    res.json({ mensaje: 'Habitación reiniciada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al reiniciar habitación' });
  }
};

const updateItemPosition = async (req, res) => {
  const usuarioId = req.body.usuario_id;
  const index = parseInt(req.params.index);
  const newPos = req.body.posicion;

  if (!usuarioId || isNaN(index) || !newPos) {
    return res.status(400).json({ error: 'Datos incompletos o inválidos' });
  }

  try {
    const result = await RoomManager.updateItemPosition(usuarioId, index, newPos);
    res.json({ message: 'Posición actualizada', result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al actualizar posición' });
  }
};

const guardarCambios = async (req, res) => {
  const { usuario_id, items } = req.body;

  if (!usuario_id || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Datos inválidos' });
  }

  try {
    await RoomManager.guardarCambios(usuario_id, items);
    res.json({ message: 'Cambios guardados correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar cambios' });
  }
};

const getRoomItemResumen = async (req, res) => {
  const usuarioId = req.query.usuario_id;
  if (!usuarioId) return res.status(400).json({ error: 'usuario_id requerido' });

  console.log("🔍 Consultando resumen para usuario:", usuarioId);

  try {
    db.all(
      `SELECT tipo FROM room_items WHERE usuario_id = ?`,
      [usuarioId],
      (err, rows) => {
        if (err) {
          console.error('❌ Error SQL:', err);
          return res.status(500).json({ error: 'Error interno' });
        }

        const resumen = {};
        rows.forEach(row => {
          resumen[row.tipo] = (resumen[row.tipo] || 0) + 1;
        });

        console.log("📦 Resumen generado:", resumen);
        res.json(resumen);
      }
    );
  } catch (err) {
    console.error('❌ Error general:', err);
    res.status(500).json({ error: 'Error al procesar solicitud' });
  }
};



module.exports = { 
  getRoomItems, 
  addRoomItem, 
  resetRoom, 
  updateItemPosition,
  guardarCambios, 
  getRoomItemResumen 
};
