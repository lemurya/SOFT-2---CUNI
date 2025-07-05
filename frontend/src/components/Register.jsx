import React, { useState } from 'react';
import {
  Box, Button, TextField, Typography, Paper, Link,
  InputAdornment, IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Register = () => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrar, setMostrar] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMensaje('');

    if (!nombre || !correo || !contrasena) {
      setMensaje('Todos los campos son obligatorios');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/usuarios/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, contrasena })
      });

      const data = await res.json();
      if (res.ok) {
        navigate('/');
      } else {
        setMensaje(data.mensaje || 'Error al registrar');
      }
    } catch (err) {
      setMensaje('Error de red al conectar con el servidor');
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
  
      <Box sx={{ flex: 1, bgcolor: '#836FFF', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <img src="/img/cuni.png" alt="Cuni" style={{ width: '200px', marginBottom: 20 }} />
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>CUNI</Typography>
        <Typography variant="h6">¡Prepárate con estilo!</Typography>
      </Box>

     
      <Box sx={{ flex: 1, bgcolor: '#FFF8E7', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: 400, borderRadius: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>
            Crear cuenta
          </Typography>
          <form onSubmit={handleRegister}>
            <TextField
              fullWidth
              label="Nombre"
              margin="normal"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <TextField
              fullWidth
              label="Correo electrónico"
              margin="normal"
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
            />
            <TextField
              fullWidth
              label="Contraseña"
              margin="normal"
              type={mostrar ? 'text' : 'password'}
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setMostrar((prev) => !prev)} edge="end">
                      {mostrar ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{ mt: 2, bgcolor: '#5D3FD3', '&:hover': { bgcolor: '#4B2FCF' }, borderRadius: 2 }}
            >
              Registrarse
            </Button>
          </form>

          {mensaje && (
            <Typography color="error" sx={{ mt: 2 }} align="center">
              {mensaje}
            </Typography>
          )}

          <Typography variant="body2" align="center" sx={{ mt: 3 }}>
            ¿Ya tienes cuenta? <Link href="/">Inicia sesión</Link>
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default Register;
