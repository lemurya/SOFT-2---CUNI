function Habitacion() {
    this.estado = {};
}

Habitacion.prototype.inicializarUsuario = function(usuario) {
    this.estado[usuario.id] = {
        hambre: 0,
        felicidad: 100
    };
};

Habitacion.prototype.alimentar = function(usuario) {
    if (!this.estado[usuario.id]) {
        this.inicializarUsuario(usuario);
    }
    this.estado[usuario.id].hambre = Math.max(0, this.estado[usuario.id].hambre - 20);
    return "Cuy alimentado";
};

Habitacion.prototype.obtenerEstado = function(usuario) {
    if (!this.estado[usuario.id]) {
        this.inicializarUsuario(usuario);
    }
    return this.estado[usuario.id];
};