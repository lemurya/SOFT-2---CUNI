const room = require('../Room/RoomSingleton');
const SillaDecorator = require('../decorators/SillaDecorator');
const MesaDecorator = require('../decorators/MesaDecorator');

const getRoomItems = (req, res) => {
  res.json(room.getItems());
};

const addRoomItem = (req, res) => {
  const { name, imageUrl, posX, posY } = req.body;

  if (!name || !imageUrl) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }

  const item = { name, imageUrl, posX, posY };

  let Decorator = null;

  switch (name.toLowerCase()) {
    case 'silla':
      Decorator = SillaDecorator;
      break;
    case 'mesa':
      Decorator = MesaDecorator;
      break;
    default:
      return res.status(400).json({ error: 'Tipo de ítem no reconocido.' });
  }

  room.equipItem(Decorator, item);

  res.status(201).json({
    message: 'Item agregado con éxito.',
    items: room.getItems()
  });
};

const resetRoom = (req, res) => {
  room.clearItems();
  res.json({ message: 'Habitación reiniciada.' });
};

module.exports = {
  getRoomItems,
  addRoomItem,
  resetRoom
};
