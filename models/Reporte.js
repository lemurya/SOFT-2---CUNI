class Reporte {
  constructor(usuario, simulacros = []) {
    this.usuario = usuario;
    this.simulacros = simulacros;
  }

  agregarSimulacro(simulacro) {
    this.simulacros.push(simulacro);
  }

  generarResumen() {
    const total = this.simulacros.length;
    const correctas = this.simulacros.reduce(function (acum, s) {
      return acum + s.correctas;
    }, 0);

    return {
      usuario: this.usuario.nombre,
      totalSimulacros: total,
      respuestasCorrectas: correctas,
      promedio: total ? correctas / total : 0
    };
  }
}

module.exports = Reporte;
