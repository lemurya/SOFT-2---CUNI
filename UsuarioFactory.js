function UsuarioFactory() {}

UsuarioFactory.prototype.crear = function(nombre, correo, contraseña) {
    var id = Math.floor(Math.random() * 10000);
    return new Usuario(id, nombre, correo, contraseña);
};