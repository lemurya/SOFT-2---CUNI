
const express = require('express');
const router = express.Router();
const { getRoomItems, addRoomItem, resetRoom, updateItemPosition, guardarCambios } = require('../controllers/RoomController');

router.get('/', getRoomItems);
router.post('/', addRoomItem);
router.delete('/', resetRoom);
router.put('/:index', updateItemPosition);
router.post('/guardar', guardarCambios);


module.exports = router;
