const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());


const userRoutes = require('./routes/UserRoutes');
const simulacroRoutes = require('./routes/SimulacroRoutes');
const reporteRoutes = require('./routes/ReporteRoutes');
const roomRoutes = require('./routes/RoomRoutes');
const tiendaRoutes = require('./routes/TiendaRoutes');


app.use('/api/usuarios', userRoutes);
app.use('/api/simulacro', simulacroRoutes);
app.use('/api/reportes', reporteRoutes);
app.use('/api/room', roomRoutes);
app.use('/api/tienda', tiendaRoutes);


const publicPath = path.join(__dirname, 'front');
app.use(express.static(publicPath));


app.get('/', (req, res) => {
  res.redirect('/index.html');
});


if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`✅ Servidor escuchando en: http://localhost:${PORT}`);
  });
}


module.exports = app;
