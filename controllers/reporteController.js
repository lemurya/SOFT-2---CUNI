const db = require('../database/db');
const Reporte = require('../models/Reporte');

const obtenerReportesPorUsuario = async (req, res) => {
  const { userId } = req.params;

  try {
    const reportes = await Reporte.obtenerPorUsuario(db, userId);
    res.json({ reportes });
  } catch (error) {
    console.error('Error al obtener reportes:', error);
    res.status(500).json({ mensaje: 'Error al obtener reportes' });
  }
};

const obtenerReportesPorTema = async (req, res) => {
  const { userId, tema } = req.params;

  try {
    const reportes = await Reporte.obtenerPorUsuarioYTema(db, userId, tema);
    res.json({ reportes });
  } catch (error) {
    console.error('Error al obtener reportes por tema:', error);
    res.status(500).json({ mensaje: 'Error al obtener reportes por tema' });
  }
};

module.exports = {
  obtenerReportesPorUsuario,
  obtenerReportesPorTema
};
