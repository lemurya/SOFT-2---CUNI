import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import CalculateIcon from '@mui/icons-material/Calculate';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ScienceIcon from '@mui/icons-material/Science';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';

import ReporteCard from './ReporteCard';
import ReporteModal from './ReporteModal';
import useReportes from './useReportes';

const Reportes = () => {
  const [usuario, setUsuario] = useState(null);
  const [temaSeleccionado, setTemaSeleccionado] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const temas = [
    { nombre: 'matematica', icono: <CalculateIcon fontSize="large" color="primary" /> },
    { nombre: 'verbal', icono: <MenuBookIcon fontSize="large" color="primary" /> },
    { nombre: 'ciencias', icono: <ScienceIcon fontSize="large" color="primary" /> },
    { nombre: 'historia', icono: <HistoryEduIcon fontSize="large" color="primary" /> },
  ];

  useEffect(() => {
    const datos = JSON.parse(localStorage.getItem('usuario'));
    setUsuario(datos);
  }, []);

  const reportes = useReportes(usuario?.id);

  const handleOpen = (tema) => {
    setTemaSeleccionado(tema);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTemaSeleccionado(null);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F2F6FC', px: 4, py: 6 }}>
      <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
        📊 Panel de Reportes por Curso
      </Typography>

      <Grid container spacing={4} justifyContent="center" sx={{ mt: 4, maxWidth: 500, mx: 'auto' }}>
        {temas.map((tema, index) => (
          <Grid item xs={6} key={index}>
            <ReporteCard tema={tema} onClick={() => handleOpen(tema.nombre)} />
          </Grid>
        ))}

        <Grid item xs={12}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.3 }}>
            <Card
              elevation={3}
              sx={{
                textAlign: 'center',
                p: 3,
                cursor: 'pointer',
                borderRadius: 3,
                maxWidth: 300,
                mx: 'auto',
                mt: 2
              }}
              onClick={() => navigate('/historial')}
            >
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                📋 HISTORIAL DE REPORTES
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ver el resumen completo de todos los cursos
              </Typography>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      <ReporteModal
        open={open}
        onClose={handleClose}
        tema={temaSeleccionado}
        reportes={reportes.filter(r => r.tema === temaSeleccionado)}
      />
    </Box>
  );
};

export default Reportes;
