function Usuario(id, nombre, correo, contraseña) {
    this.id = id;
    this.nombre = nombre;
    this.correo = correo;
    this._contraseña = contraseña;
    this.configuraciones = {};
    this.monedas = 0;
    this.experiencia = 0;
}

Usuario.prototype.iniciarSesion = function(correo, contraseña) {
    if (this.correo == correo && this._contraseña == contraseña) {
        return true;
    }
    return false;
};

Usuario.prototype.cerrarSesion = function() {
    return "Sesión cerrada";
};

Usuario.prototype.cambiarContraseña = function(nuevaContraseña) {
    if (nuevaContraseña.length >= 6) {
        this._contraseña = nuevaContraseña;
        return true;
    }
    return false;
};

Usuario.prototype.guardarConfiguraciones = function(configuraciones) {
    this.configuraciones = configuraciones;
};

Usuario.prototype.obtenerConfiguraciones = function() {
    return this.configuraciones;
};

Usuario.prototype.ganarExperiencia = function(puntos) {
    this.experiencia = this.experiencia + puntos;
    this.monedas = this.monedas + Math.floor(puntos / 10);
};