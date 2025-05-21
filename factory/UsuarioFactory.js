const Usuario = require('../models/Usuario');

class UsuarioFactory {
  static crear(nombre, correo, contrasena) {
    return new Usuario(nombre, correo, contrasena);
  }
}

module.exports = UsuarioFactory;
