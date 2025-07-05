
const ReportePorUsuario = require('../models/ReportePorUsuario');
const ReportePorTema = require('../models/ReportePorTema');

class ReporteFactory {
  static crear(tipo, usuarioId, extra = null) {
    switch (tipo) {
      case 'porUsuario':
        return new ReportePorUsuario(usuarioId);
      case 'porTema':
        return new ReportePorTema(usuarioId, extra);
      default:
        throw new Error('Tipo de reporte no válido');
    }
  }
}

module.exports = ReporteFactory;
