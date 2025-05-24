import React, { useState } from 'react';
import {
  Box, Button, TextField, Typography, Paper, Link,
  InputAdornment, IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../context/SnackbarContext';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const CambiarContrasena = () => {
  const [correo, setCorreo] = useState('');
  const [contrasenaActual, setContrasenaActual] = useState('');
  const [contrasenaNueva, setContrasenaNueva] = useState('');
  const [mostrarActual, setMostrarActual] = useState(false);
  const [mostrarNueva, setMostrarNueva] = useState(false);
  const { mostrar } = useSnackbar();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!correo || !contrasenaActual || !contrasenaNueva) {
      mostrar('Completa todos los campos', 'warning');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/usuarios/cambiar-contrasena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasena_actual: contrasenaActual, contrasena_nueva: contrasenaNueva })
      });

      const data = await res.json();
      if (res.ok) {
        mostrar(data.mensaje, 'success');
        navigate('/');
      } else {
        mostrar(data.mensaje, 'error');
      }
    } catch (err) {
      mostrar('Error al conectar con el servidor', 'error');
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Parte izquierda */}
      <Box sx={{ flex: 1, bgcolor: '#836FFF', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <img src="/img/cuni.png" alt="Cuni" style={{ width: '200px', marginBottom: 20 }} />
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>cuni</Typography>
        <Typography variant="h6">¡Prepararte nunca fue tan fácil!</Typography>
      </Box>

      {/* Parte derecha */}
      <Box sx={{ flex: 1, bgcolor: '#FFF8E7', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: 400, borderRadius: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Cambiar Contraseña
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Correo"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              margin="normal"
            />

            <TextField
              fullWidth
              label="Contraseña actual"
              type={mostrarActual ? 'text' : 'password'}
              value={contrasenaActual}
              onChange={(e) => setContrasenaActual(e.target.value)}
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setMostrarActual((prev) => !prev)} edge="end">
                      {mostrarActual ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <TextField
              fullWidth
              label="Nueva contraseña"
              type={mostrarNueva ? 'text' : 'password'}
              value={contrasenaNueva}
              onChange={(e) => setContrasenaNueva(e.target.value)}
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setMostrarNueva((prev) => !prev)} edge="end">
                      {mostrarNueva ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2, bgcolor: '#5D3FD3', ':hover': { bgcolor: '#4B2FCF' }, borderRadius: 2 }}
              type="submit"
            >
              Actualizar
            </Button>

            <Button
              fullWidth
              sx={{ mt: 1 }}
              onClick={() => navigate('/')}
            >
              Volver al Login
            </Button>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default CambiarContrasena;
