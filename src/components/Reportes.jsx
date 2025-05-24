import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Stack, Grid, Card, CardContent, Divider
} from '@mui/material';

const Reportes = () => {
  const [usuario, setUsuario] = useState(null);
  const [reportes, setReportes] = useState([]);
  const [temaSeleccionado, setTemaSeleccionado] = useState(null);
  const temas = ['matematica', 'verbal', 'ciencias', 'historia'];

  // ✅ Cargar usuario solo al inicio
  useEffect(() => {
    const datos = JSON.parse(localStorage.getItem('usuario'));
    setUsuario(datos);
  }, []);

  // ✅ Solo ejecutar fetch cuando usuario esté listo
  useEffect(() => {
    if (usuario?.id) {
      fetch(`http://localhost:3000/api/reportes/${usuario.id}`)
        .then(res => res.json())
        .then(data => setReportes(data.reportes || []))
        .catch(err => console.error('Error al cargar reportes:', err));
    }
  }, [usuario]);

  const reportesFiltrados = temaSeleccionado
    ? reportes.filter(r => r.tema.toLowerCase() === temaSeleccionado)
    : reportes;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F9F6FF', px: 6, py: 8 }}>
      <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
        Historial de Reportes
      </Typography>

      <Stack spacing={2} direction="row" justifyContent="center" flexWrap="wrap" sx={{ mb: 4 }}>
        <Button
          variant={temaSeleccionado === null ? "contained" : "outlined"}
          onClick={() => setTemaSeleccionado(null)}
        >
          TODOS
        </Button>
        {temas.map((tema) => (
          <Button
            key={tema}
            variant={temaSeleccionado === tema ? "contained" : "outlined"}
            onClick={() => setTemaSeleccionado(tema)}
          >
            REPORTE DE {tema.toUpperCase()}
          </Button>
        ))}
      </Stack>

      {reportesFiltrados.length === 0 ? (
        <Typography align="center" color="text.secondary">
          No hay reportes para este tema.
        </Typography>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {reportesFiltrados.map((r, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {r.tema.charAt(0).toUpperCase() + r.tema.slice(1)}: {r.correctas}/{r.total}
                  </Typography>
                  <Divider sx={{ my: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Fecha: {new Date(r.fecha).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Reportes;
