import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, TextField, List, ListItem, ListItemText
} from '@mui/material';

const Reportes = () => {
  const [usuario, setUsuario] = useState(null);
  const [reportes, setReportes] = useState([]);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    const datos = JSON.parse(localStorage.getItem('usuario'));
    setUsuario(datos);
    if (datos) cargarReportes(datos.id);
  }, []);

  const cargarReportes = async (userId) => {
    const res = await fetch(`http://localhost:3000/api/reportes/${userId}`);
    const data = await res.json();
    setReportes(data.reportes || []);
  };

  const filtrados = reportes.filter(r =>
    r.tema.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h6" gutterBottom>
        Historial de Reportes
      </Typography>
      <TextField
        fullWidth
        label="Filtrar por tema"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        sx={{ mb: 2 }}
      />
      <List>
        {filtrados.map((r, i) => (
          <ListItem key={i} divider>
            <ListItemText
              primary={`${r.tema} - ${r.correctas}/${r.total}`}
              secondary={`Fecha: ${r.fecha}`}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default Reportes;
