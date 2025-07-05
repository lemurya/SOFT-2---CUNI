import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Avatar, Grid
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import { useUsuario } from '../context/UserContext';

const Dashboard = () => {
  const { usuario, setUsuario } = useUsuario();
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    
    const obtenerDatos = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/usuarios/perfil-id?id=${usuario.id}`);
        const data = await res.json();
        if (data.perfil) {
          setUsuario(data.perfil);
        }
      } catch (err) {
        console.error('❌ Error al obtener perfil:', err);
      } finally {
        setCargando(false);
      }
    };

    obtenerDatos();
  }, [usuario.id, setUsuario]);

  if (cargando || !usuario) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6">Cargando usuario...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '100%',
        bgcolor: '#F3F0FF',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        paddingTop: '64px',
        boxSizing: 'border-box'
      }}
    >
      <Paper elevation={3} sx={{ p: 5, borderRadius: 4, maxWidth: 900, width: '100%' }}>
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <img src="/img/cuni.png" alt="Cuni" style={{ width: '180px' }} />
          </Grid>

          <Grid item xs={12} md={8}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: '#7F6FAE', mr: 3 }}>
                {usuario.nombre[0]?.toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold">{usuario.nombre}</Typography>
                <Typography variant="body1" color="text.secondary">{usuario.correo}</Typography>
              </Box>
            </Box>

            <Grid container spacing={4}>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <EmojiEventsIcon sx={{ fontSize: 50, color: '#FFD700' }} />
                  <Typography variant="h5">{usuario.experiencia} XP</Typography>
                  <Typography variant="body1">Experiencia</Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ textAlign: 'center' }}>
                  <MonetizationOnIcon sx={{ fontSize: 50, color: '#4CAF50' }} />
                  <Typography variant="h5">{usuario.monedas}</Typography>
                  <Typography variant="body1">Monedas</Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Dashboard;
