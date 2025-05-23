import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Avatar
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const Dashboard = () => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const datos = JSON.parse(localStorage.getItem('usuario'));
    setUsuario(datos);
  }, []);

  if (!usuario) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6">Cargando usuario...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#F9F6FF',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 4
      }}
    >
      <Paper sx={{ p: 4, maxWidth: 500, width: '100%', borderRadius: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ width: 64, height: 64, bgcolor: '#836FFF', mr: 2 }}>
            {usuario.nombre[0]?.toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">{usuario.nombre}</Typography>
            <Typography variant="body2" color="text.secondary">{usuario.correo}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Box sx={{ textAlign: 'center' }}>
            <EmojiEventsIcon sx={{ fontSize: 40, color: '#FFD700' }} />
            <Typography variant="h6">{usuario.experiencia} XP</Typography>
            <Typography variant="body2">Experiencia</Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <MonetizationOnIcon sx={{ fontSize: 40, color: '#4CAF50' }} />
            <Typography variant="h6">{usuario.monedas}</Typography>
            <Typography variant="body2">Monedas</Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Dashboard;
