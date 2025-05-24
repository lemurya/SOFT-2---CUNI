import React, { useState } from 'react';
import {
  Box, Button, TextField, Typography, Paper, Checkbox, FormControlLabel, Link,
  InputAdornment, IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje('');

    if (!aceptaTerminos) {
      setMensaje('Debes aceptar los términos y condiciones.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ correo, contrasena })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('usuario', JSON.stringify(data.datos));
        navigate('/dashboard');
      } else {
        setMensaje(data.mensaje || 'Error al iniciar sesión');
      }
    } catch (error) {
      setMensaje('Error de red al conectar con el servidor');
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Box sx={{ flex: 1, bgcolor: '#836FFF', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <img src="/img/cuni.png" alt="Cuni" style={{ width: '200px', marginBottom: 20 }} />
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>cuni</Typography>
        <Typography variant="h6">¡Prepararte nunca fue tan fácil!</Typography>
      </Box>

      <Box sx={{ flex: 1, bgcolor: '#FFF8E7', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: 400, borderRadius: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Iniciar Sesión
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email o Usuario"
              margin="normal"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />

            <TextField
              fullWidth
              label="Contraseña"
              margin="normal"
              type={mostrarContrasena ? 'text' : 'password'}
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setMostrarContrasena((prev) => !prev)} edge="end">
                      {mostrarContrasena ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Typography variant="body2" sx={{ mt: 1 }}>
              ¿Olvidaste tu contraseña?{' '}
              <Link href="/cambiar-contrasena">Recupérala</Link>
            </Typography>

            <FormControlLabel
              control={<Checkbox checked={aceptaTerminos} onChange={(e) => setAceptaTerminos(e.target.checked)} />}
              label={<Typography variant="body2">Aceptar <Link href="#">términos y condiciones</Link></Typography>}
              sx={{ mt: 1 }}
            />

            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{ mt: 2, bgcolor: '#5D3FD3', '&:hover': { bgcolor: '#4B2FCF' }, borderRadius: 2 }}
            >
              Ingresar
            </Button>
          </form>

          {mensaje && <Typography color="error" sx={{ mt: 2 }} align="center">{mensaje}</Typography>}

          <Typography variant="body2" align="center" sx={{ mt: 3 }}>
            ¿Aún no tienes cuenta? <Link href="/register">Regístrate</Link>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;
