class Usuario {
  constructor(nombre, correo, contrasena) {
    this.nombre = nombre;
    this.correo = correo;
    this._contrasena = contrasena;
    this.configuracion = {};
    this.experiencia = 0;
    this.monedas = 0;
  }

  verificarCredenciales(correo, contrasena) {
    return this.correo === correo && this._contrasena === contrasena;
  }

  cambiarContrasena(nuevaContrasena) {
    this._contrasena = nuevaContrasena;
  }

  actualizarPerfil(configuracion) {
    this.configuracion = configuracion;
  }

  recibirRecompensa(exp, coins) {
    this.experiencia += exp;
    this.monedas += coins;
  }

  obtenerDatos() {
    return {
      nombre: this.nombre,
      correo: this.correo,
      experiencia: this.experiencia,
      monedas: this.monedas,
      configuracion: this.configuracion
    };
  }
}

module.exports = Usuario;
