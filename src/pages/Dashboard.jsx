import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const Dashboard = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario')) || {};

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
    >
      <Paper
        elevation={4}
        sx={{
          p: 4,
          width: '400px',
          backgroundColor: '#FFF6D1',
          borderRadius: '12px',
          boxShadow: 3
        }}
      >
        <Typography variant="h5" fontWeight="bold" align="center" color="#40245D" gutterBottom>
          ¡Bienvenido, {usuario.nombre}!
        </Typography>

        <Typography sx={{ mt: 2 }}>
          📧 <strong>Correo:</strong> {usuario.correo}
        </Typography>

        <Typography sx={{ mt: 2 }}>
          🧠 <strong>Experiencia:</strong> {usuario.experiencia} XP
        </Typography>

        <Typography sx={{ mt: 2 }}>
         💲 <strong>Monedas:</strong> {usuario.monedas}
        </Typography>
      </Paper>
    </Box>
  );
};

export default Dashboard;
