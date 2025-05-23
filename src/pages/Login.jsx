import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, TextField, Button, Typography, Paper,
  Checkbox, FormControlLabel, Link
} from '@mui/material';

const Login = () => {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasena })
      });

      const data = await res.json();
      if (res.ok && data.datos) {
        localStorage.setItem('usuario', JSON.stringify(data.datos));
        navigate('/dashboard');
      } else {
        setError(data.mensaje || 'Credenciales incorrectas');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor');
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Panel izquierdo */}
      <Box
        sx={{
          width: '50%',
          backgroundColor: '#8E74E1',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: 4
        }}
      >
        <Typography variant="h2" sx={{ fontWeight: 'bold', fontFamily: 'monospace', mb: 2 }}>
          cuni
        </Typography>
        <img
          src="/mascota-cuni.png"
          alt="Cuni"
          style={{ width: 200, height: 'auto', marginBottom: 20 }}
        />
        <Typography variant="h6">¡Prepararte nunca fue tan fácil!</Typography>
      </Box>

      {/* Panel derecho */}
      <Box
        sx={{
          width: '50%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f5f5f5'
        }}
      >
        <Paper elevation={3} sx={{
          p: 4,
          width: '90%',
          maxWidth: 400,
          borderRadius: 4,
          backgroundColor: '#f9f1c7'
        }}>
          <Typography variant="h5" align="center" gutterBottom>
            Iniciar Sesión
          </Typography>
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              margin="normal"
              label="Email o Usuario"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Contraseña"
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />
            <Box sx={{ textAlign: 'right', mb: 1 }}>
              <Link component="button" variant="body2" onClick={() => navigate('/cambiar-contrasena')}>
                ¿Olvidaste tu contraseña? <strong>Recupérala</strong>
              </Link>
            </Box>

            <FormControlLabel
              control={<Checkbox defaultChecked />}
              label="Aceptar términos y condiciones"
            />

            {error && <Typography color="error" variant="body2">{error}</Typography>}

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{ mt: 2, backgroundColor: '#40245D', color: '#fff' }}
            >
              INGRESAR
            </Button>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2">
              ¿Aún no tienes una cuenta?{' '}
              <Link component="button" onClick={() => navigate('/register')}>
                <strong>Regístrate</strong>
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;
