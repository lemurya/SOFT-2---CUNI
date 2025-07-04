import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, TextField, Divider,
  MenuItem, Select, InputLabel, FormControl, Button, Grid
} from '@mui/material';
import GraficoResultados from './GraficoResultados';
import useHistorialReportes from './useHistorialReportes';
import { generarPDFReporte } from '../../utils/generarPDFReporte';

const temas = ['matematica', 'verbal', 'ciencias', 'historia'];

const HistorialReportes = () => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const datos = JSON.parse(localStorage.getItem('usuario'));
    setUsuario(datos);
  }, []);

  const {
    reportesFiltrados,
    temaSeleccionado,
    setTemaSeleccionado,
    fechaInicio,
    fechaFin,
    setFechaInicio,
    setFechaFin
  } = useHistorialReportes(usuario);

  const dataGrafico = reportesFiltrados.map((r, i) => ({
    intento: `#${i + 1}`,
    correctas: r.correctas,
    incorrectas: r.total - r.correctas
  }));

  const handleGenerarPDF = () => {
    generarPDFReporte(temaSeleccionado, usuario, reportesFiltrados);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F2F6FC', px: 4, py: 6 }}>
      <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
        📋 Historial de Reportes Detallado
      </Typography>

      <Box sx={{ maxWidth: 900, mx: 'auto', mb: 4 }}>
        <Grid container spacing={2}>
          <Grid sx={{ flexBasis: { xs: '100%', sm: '33.33%' }, flexGrow: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Curso</InputLabel>
              <Select
                value={temaSeleccionado}
                label="Curso"
                onChange={(e) => setTemaSeleccionado(e.target.value)}
              >
                {temas.map((tema, idx) => (
                  <MenuItem key={idx} value={tema}>
                    {tema.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid sx={{ flexBasis: { xs: '100%', sm: '33.33%' }, flexGrow: 1 }}>
            <TextField
              label="Desde"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </Grid>

          <Grid sx={{ flexBasis: { xs: '100%', sm: '33.33%' }, flexGrow: 1 }}>
            <TextField
              label="Hasta"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
          </Grid>
        </Grid>
      </Box>

      <Divider sx={{ mb: 4 }} />

      <Card elevation={3}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            📘 {temaSeleccionado.toUpperCase()}
          </Typography>

          {reportesFiltrados.length === 0 ? (
            <Typography color="text.secondary">
              No hay reportes disponibles para este curso en el rango seleccionado.
            </Typography>
          ) : (
            <>
              <GraficoResultados data={dataGrafico} />

              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Button variant="outlined" color="primary" onClick={handleGenerarPDF}>
                  Descargar Reporte PDF
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default HistorialReportes;
