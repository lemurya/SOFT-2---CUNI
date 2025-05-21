const db = require('../database/db');

function agregarReporte(req, res) {
  const { usuario_id, correctas, total } = req.body;

  const sql = `INSERT INTO reportes (usuario_id, correctas, total) VALUES (?, ?, ?)`;
  db.run(sql, [usuario_id, correctas, total], function(err) {
    if (err) {
      res.status(500).json({ mensaje: "Error al guardar el reporte", error: err.message });
    } else {
      res.json({ mensaje: "Reporte guardado", id: this.lastID });
    }
  });
}

function obtenerReportes(req, res) {
  const { usuario_id } = req.query;

  const sql = `SELECT * FROM reportes WHERE usuario_id = ?`;
  db.all(sql, [usuario_id], function(err, rows) {
    if (err) {
      res.status(500).json({ mensaje: "Error al obtener reportes" });
    } else {
      res.json({ reportes: rows });
    }
  });
}

module.exports = { agregarReporte, obtenerReportes };
