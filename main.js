// Requiere que los archivos estén en el mismo HTML o node env si se adapta

var bd = new BaseDatos();
var factory = new UsuarioFactory();

var nuevoUsuario = factory.crear("Santiago", "santi@mail.com", "123456");
bd.agregarUsuario(nuevoUsuario);

var login = bd.obtenerUsuarioPorCorreo("santi@mail.com");
if (login.iniciarSesion("santi@mail.com", "123456")) {
    console.log("Inicio de sesión exitoso");
}

var reporte = new Reporte(nuevoUsuario.id);
reporte.registrarSimulacro(8, 2);
bd.agregarReporte(reporte);

console.log(reporte.generarResumen());