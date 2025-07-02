class Reporte {
  constructor(usuarioId, tema, correctas, total, fecha = new Date()) {
    this.usuarioId = usuarioId;
    this.tema = tema;
    this.correctas = correctas;
    this.total = total;
    this.fecha = fecha.toISOString();
  }

  guardarEnDB(db) {
    return new Promise((resolve, reject) => {
      const sql = `
        INSERT INTO reportes (usuario_id, correctas, total, fecha, tema)
        VALUES (?, ?, ?, ?, ?)
      `;
      db.run(sql, [this.usuarioId, this.correctas, this.total, this.fecha, this.tema], function (err) {
        if (err) reject(err);
        else resolve({ mensaje: 'Reporte guardado', id: this.lastID });
      });
    });
  }

  static obtenerPorUsuario(db, usuarioId) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT tema, correctas, total, fecha
        FROM reportes
        WHERE usuario_id = ?
        ORDER BY fecha DESC
      `;
      db.all(sql, [usuarioId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  static obtenerPorUsuarioYTema(db, usuarioId, tema) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT tema, correctas, total, fecha
        FROM reportes
        WHERE usuario_id = ? AND tema = ?
        ORDER BY fecha DESC
      `;
      db.all(sql, [usuarioId, tema], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
}

module.exports = Reporte;
