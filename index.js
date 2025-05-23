const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Importar rutas
const roomRoutes = require('./routes/RoomRoutes');
const simulacroRoutes = require('./routes/SimulacroRoutes'); 

// Rutas API
app.use('/api/room', roomRoutes);
app.use('/api/simulacro', simulacroRoutes);

// Servir archivos estáticos (simulacro/)
const publicPath = path.join(__dirname, 'simulacro');
app.use(express.static(publicPath));

// Redirigir / → /simulacro.html
app.get('/', (req, res) => {
  res.redirect('/simulacro.html');
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
