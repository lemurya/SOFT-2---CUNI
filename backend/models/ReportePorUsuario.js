const BaseReporte = require('./BaseReporte');
const Reporte = require('./Reporte');
console.log('🧪 obtenerPorUsuario existe:', typeof Reporte.obtenerPorUsuario);

class ReportePorUsuario extends BaseReporte {
  constructor(usuarioId) {
    super(usuarioId);
  }

  obtener(db) {
    return Reporte.obtenerPorUsuario(db, this.usuarioId);
  }
}

module.exports = ReportePorUsuario;
