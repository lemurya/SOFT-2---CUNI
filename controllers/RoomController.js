const room = require('../Room/RoomSingleton');

const getRoomItems = (req, res) => {
  res.json(room.getItems());
};

const addRoomItem = (req, res) => {
  const { name, imageUrl, posX, posY } = req.body;

  if (!name || !imageUrl) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }

  const item = { name, imageUrl, posX, posY };
  room.equipItem(item);
  res.status(201).json({ message: 'Item equipado con éxito.', item });
};

const resetRoom = (req, res) => {
  room.clearItems();
  res.json({ message: 'Habitación reiniciada.' });
};

module.exports = { getRoomItems, addRoomItem, resetRoom };
