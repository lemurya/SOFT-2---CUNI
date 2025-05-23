import React, { useState } from 'react';
import {
  Box, Button, TextField, Typography, Paper
} from '@mui/material';

const CambiarContrasena = () => {
  const [correo, setCorreo] = useState('');
  const [contrasenaActual, setContrasenaActual] = useState('');
  const [contrasenaNueva, setContrasenaNueva] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/usuarios/cambiar-contrasena`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correo,
          contrasena_actual: contrasenaActual,
          contrasena_nueva: contrasenaNueva
        })
      });

      const data = await res.json();
      setMensaje(data.mensaje || 'Error al cambiar la contraseña');
    } catch (error) {
      setMensaje('Error de red al conectar con el servidor');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#FFF8E7' }}>
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Cambiar Contraseña
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Correo"
            margin="normal"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />
          <TextField
            fullWidth
            type="password"
            label="Contraseña actual"
            margin="normal"
            value={contrasenaActual}
            onChange={(e) => setContrasenaActual(e.target.value)}
          />
          <TextField
            fullWidth
            type="password"
            label="Nueva contraseña"
            margin="normal"
            value={contrasenaNueva}
            onChange={(e) => setContrasenaNueva(e.target.value)}
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{ mt: 2, bgcolor: '#5D3FD3', '&:hover': { bgcolor: '#4B2FCF' } }}
          >
            Cambiar
          </Button>
        </form>
        {mensaje && (
          <Typography color="error" sx={{ mt: 2 }} align="center">
            {mensaje}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default CambiarContrasena;
