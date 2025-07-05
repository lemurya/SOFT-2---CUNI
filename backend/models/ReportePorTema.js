const BaseReporte = require('./BaseReporte');
const Reporte = require('./Reporte');

class ReportePorTema extends BaseReporte {
  constructor(usuarioId, tema) {
    super(usuarioId);
    this.tema = tema;
  }

  obtener(db) {
    return Reporte.obtenerPorUsuarioYTema(db, this.usuarioId, this.tema);
  }
}

module.exports = ReportePorTema;
