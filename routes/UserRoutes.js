
const express = require('express');
const {
  registrarUsuario,
  login,
  cambiarContrasena,
  actualizarNombre,
  obtenerPerfil
} = require('../controllers/usuarioController');

const router = express.Router();

router.post('/registro', registrarUsuario);
router.post('/login', login);
router.post('/cambiar-contrasena', cambiarContrasena);
router.post('/cambiar-nombre', actualizarNombre);
router.get('/perfil', obtenerPerfil);

module.exports = router;
