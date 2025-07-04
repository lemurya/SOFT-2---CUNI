const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Importar rutas desde /routes
const userRoutes = require('./routes/UserRoutes');
const simulacroRoutes = require('./routes/SimulacroRoutes');
const reporteRoutes = require('./routes/ReporteRoutes');
const roomRoutes = require('./routes/RoomRoutes');
const tiendaRoutes = require('./routes/TiendaRoutes');

// Usar las rutas
app.use('/api/usuarios', userRoutes);
app.use('/api/simulacro', simulacroRoutes);
app.use('/api/reportes', reporteRoutes);
app.use('/api/room', roomRoutes);
app.use('/api/tienda', tiendaRoutes);

// Servir archivos estáticos desde /front
const publicPath = path.join(__dirname, 'front');
app.use(express.static(publicPath));

// Redireccionar "/" al index del frontend
app.get('/', (req, res) => {
  res.redirect('/index.html');
});

// Iniciar el servidor
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ Servidor escuchando en: http://localhost:${PORT}`);
  });
}

// Exportar la app para pruebas
module.exports = app;
