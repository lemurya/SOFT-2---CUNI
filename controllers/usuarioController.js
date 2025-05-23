
const db = require('../database/db');

function registrarUsuario(req, res) {
  const { nombre, correo, contrasena } = req.body;
  db.run("INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)", [nombre, correo, contrasena],
    function (err) {
      if (err) return res.status(500).json({ mensaje: 'Error al registrar' });
      res.json({ mensaje: 'Usuario registrado', id: this.lastID });
    });
}

function login(req, res) {
  const { correo, contrasena } = req.body;
  db.get("SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?", [correo, contrasena], (err, row) => {
    if (err) return res.status(500).json({ mensaje: 'Error en la consulta' });
    if (row) {
      res.json({ mensaje: 'Inicio de sesión exitoso', datos: row });
    } else {
      res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }
  });
}

function cambiarContrasena(req, res) {
  const { correo, contrasena_actual, contrasena_nueva } = req.body;
  db.get("SELECT * FROM usuarios WHERE correo = ?", [correo], (err, usuario) => {
    if (err || !usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    if (usuario.contrasena !== contrasena_actual)
      return res.status(401).json({ mensaje: 'Contraseña actual incorrecta' });

    db.run("UPDATE usuarios SET contrasena = ? WHERE correo = ?", [contrasena_nueva, correo], err => {
      if (err) return res.status(500).json({ mensaje: 'Error al cambiar contraseña' });
      res.json({ mensaje: 'Contraseña actualizada correctamente' });
    });
  });
}

function actualizarNombre(req, res) {
  const { correo, nuevoNombre } = req.body;
  db.run("UPDATE usuarios SET nombre = ? WHERE correo = ?", [nuevoNombre, correo], err => {
    if (err) return res.status(500).json({ mensaje: 'Error al actualizar el nombre' });
    res.json({ mensaje: 'Nombre actualizado correctamente' });
  });
}

function obtenerPerfil(req, res) {
  const { correo } = req.query;
  db.get("SELECT nombre, correo, experiencia, monedas FROM usuarios WHERE correo = ?", [correo], (err, row) => {
    if (err || !row) return res.status(404).json({ mensaje: 'Perfil no encontrado' });
    res.json({ perfil: row });
  });
}

module.exports = {
  registrarUsuario,
  login,
  cambiarContrasena,
  actualizarNombre,
  obtenerPerfil
};
