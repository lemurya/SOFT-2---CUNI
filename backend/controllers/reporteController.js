const db = require('../database/db');
const ReporteFactory = require('../factories/ReporteFactory');

const obtenerReportesPorUsuario = async (req, res) => {
  const { userId } = req.params;

  try {
    const reporte = ReporteFactory.crear('porUsuario', userId);
    const reportes = await reporte.obtener(db);
    res.json({ reportes });
  } catch (error) {
    console.error('Error al obtener reportes:', error);
    res.status(500).json({ mensaje: 'Error al obtener reportes' });
  }
};

const obtenerReportesPorTema = async (req, res) => {
  const { userId, tema } = req.params;

  try {
    const reporte = ReporteFactory.crear('porTema', userId, tema);
    const reportes = await reporte.obtener(db);
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
