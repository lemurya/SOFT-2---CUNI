function BaseDatos() {
    this.usuarios = [];
    this.reportes = [];
}

BaseDatos.prototype.agregarUsuario = function(usuario) {
    this.usuarios.push(usuario);
};

BaseDatos.prototype.obtenerUsuarioPorCorreo = function(correo) {
    for (var i = 0; i < this.usuarios.length; i++) {
        if (this.usuarios[i].correo == correo) {
            return this.usuarios[i];
        }
    }
    return null;
};

BaseDatos.prototype.agregarReporte = function(reporte) {
    this.reportes.push(reporte);
};

BaseDatos.prototype.obtenerReportePorUsuarioId = function(usuarioId) {
    for (var i = 0; i < this.reportes.length; i++) {
        if (this.reportes[i].usuarioId == usuarioId) {
            return this.reportes[i];
        }
    }
    return null;
};