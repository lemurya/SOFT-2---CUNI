const RoomManager = require('../managers/RoomManager');
const SillaDecorator = require('../decorators/SillaDecorator');
const MesaDecorator = require('../decorators/MesaDecorator');
const ItemDecorator = require('../decorators/ItemDecorator');

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

module.exports = { getRoomItems, addRoomItem, resetRoom };
