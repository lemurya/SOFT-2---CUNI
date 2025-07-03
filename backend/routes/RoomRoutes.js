
const express = require('express');
const router = express.Router();
const { getRoomItems, addRoomItem, resetRoom, updateItemPosition, guardarCambios, getRoomItemResumen } = require('../controllers/RoomController');

router.get('/', getRoomItems);
router.post('/', addRoomItem);
router.delete('/', resetRoom);
router.put('/:index', updateItemPosition);
router.post('/guardar', guardarCambios);
router.get('/resumen', getRoomItemResumen);


module.exports = router;
