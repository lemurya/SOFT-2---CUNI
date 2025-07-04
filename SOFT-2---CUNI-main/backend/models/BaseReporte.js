class BaseReporte {
    constructor(usuarioId) {
      this.usuarioId = usuarioId;
    }
  
    obtener(db) {
      throw new Error('Método obtener() debe ser implementado');
    }
  }
  
  module.exports = BaseReporte;
  