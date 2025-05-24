function Reporte(usuarioId) {
    this.usuarioId = usuarioId;
    this.totalIntentos = 0;
    this.totalCorrectas = 0;
    this.totalIncorrectas = 0;
}

Reporte.prototype.registrarSimulacro = function(correctas, incorrectas) {
    this.totalIntentos = this.totalIntentos + 1;
    this.totalCorrectas = this.totalCorrectas + correctas;
    this.totalIncorrectas = this.totalIncorrectas + incorrectas;
};

Reporte.prototype.generarResumen = function() {
    var total = this.totalCorrectas + this.totalIncorrectas;
    var porcentaje = 0;

    if (total > 0) {
        porcentaje = (this.totalCorrectas * 100) / total;
    }

    return {
        usuarioId: this.usuarioId,
        intentos: this.totalIntentos,
        porcentaje: porcentaje.toFixed(2)
    };
};