const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { registrarUsuario, login, cambiarContrasena, obtenerPerfil, actualizarNombre } = require('./controllers/usuarioController');
const { agregarReporte, obtenerReportes } = require('./controllers/reporteController');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/registro', registrarUsuario);
app.post('/api/login', login);
app.post('/api/cambiar-contrasena', cambiarContrasena);
app.post('/api/reportes', agregarReporte);
app.get('/api/reportes', obtenerReportes);
app.get('/api/perfil', obtenerPerfil);
app.post('/api/actualizar-nombre', actualizarNombre);

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
