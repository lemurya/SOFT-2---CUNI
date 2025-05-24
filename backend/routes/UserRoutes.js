const express = require('express');
const {
  registrarUsuario,
  login,
  cambiarContrasena,
  actualizarNombre,
  obtenerPerfil,
  obtenerPerfilPorId
} = require('../controllers/usuarioController');

const router = express.Router();

// Rutas válidas
router.post('/registro', registrarUsuario);
router.post('/login', login);
router.post('/cambiar-contrasena', cambiarContrasena);
router.post('/cambiar-nombre', actualizarNombre);
router.get('/perfil', obtenerPerfil);

// ✅ ESTA es la que debes mantener
router.get('/perfil-id', obtenerPerfilPorId);

module.exports = router;
