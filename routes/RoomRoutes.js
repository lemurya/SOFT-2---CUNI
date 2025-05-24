
const express = require('express');
const router = express.Router();
const { getRoomItems, addRoomItem, resetRoom } = require('../controllers/RoomController');

router.get('/', getRoomItems);
router.post('/', addRoomItem);
router.delete('/', resetRoom);

module.exports = router;
