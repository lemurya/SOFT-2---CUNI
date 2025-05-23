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

const cambiarContrasena = async (req, res) => {
  try {
    const { correo, usuario_id, contrasena_actual, contrasena_nueva } = req.body;

    if (!contrasena_actual || !contrasena_nueva || (!usuario_id && !correo)) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
    }

    const usuario = usuario_id
      ? await getUsuarioById(usuario_id)
      : await getUsuarioByCorreo(correo);

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    if (usuario.contrasena !== contrasena_actual) {
      return res.status(401).json({ mensaje: 'Contraseña actual incorrecta' });
    }

    db.run(`UPDATE usuarios SET contrasena = ? WHERE id = ?`, [contrasena_nueva, usuario.id], function (err) {
      if (err) {
        return res.status(500).json({ mensaje: 'Error al actualizar contraseña', error: err.message });
      }
      res.status(200).json({ mensaje: 'Contraseña actualizada correctamente.' });
    });

  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

function getUsuarioByCorreo(correo) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM usuarios WHERE correo = ?`, [correo], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function getUsuarioById(id) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM usuarios WHERE id = ?`, [id], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

const obtenerPerfil = (req, res) => {
  const { correo } = req.query;
  db.get("SELECT nombre, correo FROM usuarios WHERE correo = ?", [correo], (err, row) => {
    if (err) {
      return res.status(500).json({ mensaje: "Error al obtener el perfil" });
    }
    if (!row) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.json({ perfil: row });
  });
};

const actualizarNombre = (req, res) => {
  const { correo, nuevoNombre } = req.body;

  db.run("UPDATE usuarios SET nombre = ? WHERE correo = ?", [nuevoNombre, correo], function (err) {
    if (err) {
      return res.status(500).json({ mensaje: "Error al actualizar el nombre" });
    }

    res.json({ mensaje: "Nombre actualizado correctamente" });
  });
};

module.exports = {
  registrarUsuario,
  login,
  cambiarContrasena,
  obtenerPerfil,
  actualizarNombre
};
