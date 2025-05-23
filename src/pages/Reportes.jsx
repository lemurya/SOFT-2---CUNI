import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Paper, List, ListItem, ListItemText
} from '@mui/material';

const Reportes = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [reportes, setReportes] = useState([]);

  useEffect(() => {
    const datos = localStorage.getItem('usuario');
    if (datos) {
      const usuarioJSON = JSON.parse(datos);
      setUsuario(usuarioJSON);
      fetch(`http://localhost:3000/api/reportes?usuario_id=${usuarioJSON.id}`)
        .then(res => res.json())
        .then(data => {
          setReportes(data.reportes || []);
        });
    } else {
      navigate('/login');
    }
  }, [navigate]);

  if (!usuario) return null;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Paper sx={{ p: 4, mt: 4, width: 600 }}>
        <Typography variant="h5" gutterBottom>
          Tus Reportes de Simulacros
        </Typography>
        {reportes.length === 0 ? (
          <Typography variant="body1">No hay reportes disponibles.</Typography>
        ) : (
          <List>
            {reportes.map((r) => (
              <ListItem key={r.id} divider>
                <ListItemText
                  primary={`Fecha: ${new Date(r.fecha).toLocaleString()}`}
                  secondary={`Correctas: ${r.correctas} / ${r.total}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default Reportes;
