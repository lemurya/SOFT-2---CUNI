const express = require('express');
const router = express.Router();
const { getRoomItems, addRoomItem, resetRoom } = require('../controllers/RoomController');

//define apis
router.get('/', getRoomItems);      //get
router.post('/', addRoomItem);      //post(equip)
router.delete('/', resetRoom);      //delete(restart)

module.exports = router;
