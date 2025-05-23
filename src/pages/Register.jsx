import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, TextField, Button, Typography, Paper, Link
} from '@mui/material';

const Register = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    try {
      const res = await fetch('http://localhost:3000/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, contrasena })
      });

      const data = await res.json();
      if (res.ok) {
        setMensaje(data.mensaje || 'Registro exitoso.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.mensaje || 'Error al registrar.');
      }
    } catch (err) {
      setError('Error al conectar con el servidor.');
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
        <Typography variant="h6">¡Únete y empieza tu preparación!</Typography>
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
            Registro de Usuario
          </Typography>
          <form onSubmit={handleRegister}>
            <TextField
              fullWidth
              margin="normal"
              label="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Correo"
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

            {error && <Typography color="error">{error}</Typography>}
            {mensaje && <Typography color="primary">{mensaje}</Typography>}

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{ mt: 2, backgroundColor: '#40245D', color: '#fff' }}
            >
              REGISTRARSE
            </Button>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2">
              ¿Ya tienes cuenta?{' '}
              <Link component="button" onClick={() => navigate('/login')}>
                <strong>Inicia sesión</strong>
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Register;
