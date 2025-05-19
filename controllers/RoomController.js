const room = require('../services/RoomSingleton');
const getDecoratorByName = require('../utils/DecoratorFactory');

//get
const getRoomItems = (req, res) => {
  res.json(room.getItems());
};

//post
const addRoomItem = (req, res) => {
  const { name, imageUrl, posX, posY } = req.body;

  if (!name || !imageUrl) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }

  const Decorator = getDecoratorByName(name);
  if (!Decorator) {
    return res.status(400).json({ error: 'Tipo de ítem no reconocido.' });
  }

  const item = { name, imageUrl, posX, posY };
  room.equipItem(Decorator, item);

  res.status(201).json({
    message: 'Item decorado con éxito.',
    items: room.getItems()
  });
};

//delete
const resetRoom = (req, res) => {
  room.clearItems();
  res.json({ message: 'Habitación reiniciada.' });
};

module.exports = { getRoomItems, addRoomItem, resetRoom };
