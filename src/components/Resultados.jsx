import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Paper } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

const Resultados = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resultado = location.state;

  if (!resultado) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6">No hay datos disponibles</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#F9F6FF', // mismo color que dashboard
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 6,
        px: 2
      }}
    >
      <Paper
        elevation={5}
        sx={{
          p: 4,
          bgcolor: 'white',
          borderRadius: 4,
          width: 400,
          textAlign: 'center'
        }}
      >
        <img src="/img/resultado.png" alt="Resultado" style={{ width: 120, marginBottom: 20 }} />

        <Typography variant="h5" fontWeight="bold" gutterBottom color="#5D3FD3">
          ¡Simulacro finalizado!
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            mt: 3,
            mb: 2
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <EmojiEventsIcon sx={{ fontSize: 32, color: '#4FC3F7' }} />
            <Typography variant="h6">{resultado.experienciaGanada} XP</Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <MonetizationOnIcon sx={{ fontSize: 32, color: '#FFD54F' }} />
            <Typography variant="h6">{resultado.monedasGanadas}</Typography>
          </Box>
        </Box>

        <Typography variant="body1" sx={{ mt: 2 }}>
          Preguntas correctas: {resultado.correctas}
        </Typography>
        <Typography variant="body1">
          Preguntas incorrectas: {resultado.incorrectas}
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate('/dashboard')}
          sx={{
            mt: 4,
            bgcolor: '#5D3FD3',
            '&:hover': { bgcolor: '#4528A4' },
            borderRadius: 4
          }}
        >
          Continuar
        </Button>
      </Paper>
    </Box>
  );
};

export default Resultados;
