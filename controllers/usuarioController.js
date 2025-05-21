const db = require('../database/db');

function registrarUsuario(req, res) {
  const { nombre, correo, contrasena } = req.body;

  const sql = `INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)`;
  db.run(sql, [nombre, correo, contrasena], function(err) {
    if (err) {
      res.status(500).json({ mensaje: "Error al registrar", error: err.message });
    } else {
      res.json({ mensaje: "Usuario registrado", id: this.lastID });
    }
  });
}

function login(req, res) {
  const { correo, contrasena } = req.body;

  const sql = `SELECT * FROM usuarios WHERE correo = ? AND contrasena = ?`;
  db.get(sql, [correo, contrasena], function(err, row) {
    if (err) {
      res.status(500).json({ mensaje: "Error en la consulta" });
    } else if (row) {
      res.json({
        mensaje: "Inicio de sesión exitoso",
        datos: {
          id: row.id,
          nombre: row.nombre,
          correo: row.correo,
          experiencia: row.experiencia,
          monedas: row.monedas
        }
      });
    } else {
      res.status(401).json({ mensaje: "Credenciales incorrectas" });
    }
  });
}

module.exports = { registrarUsuario, login };
