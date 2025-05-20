const room = require('../Room/RoomSingleton');

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

  const item = { name, imageUrl, posX, posY };
  room.equipItem(item);
  res.status(201).json({ message: 'Item equipado con éxito.', item });
  console.log('Items actuales:', room.getItems());
};

//restar(delete)
const resetRoom = (req, res) => {
  room.clearItems();
  res.json({ message: 'Habitación reiniciada.' });
};

module.exports = { getRoomItems, addRoomItem, resetRoom };
