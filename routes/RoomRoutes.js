const express = require('express');
const router = express.Router();
const { getRoomItems, addRoomItem, resetRoom } = require('../controllers/RoomController');

router.get('/', getRoomItems);      // Ver items equipados
router.post('/', addRoomItem);      // Equipar un nuevo item
router.delete('/', resetRoom);      // Reiniciar habitación

module.exports = router;
