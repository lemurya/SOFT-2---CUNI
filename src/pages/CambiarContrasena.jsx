import React, { useState } from 'react';
import {
  Box, TextField, Button, Typography, Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Link } from '@mui/material';


const CambiarContrasena = () => {
  const [correo, setCorreo] = useState('');
  const [contrasenaActual, setContrasenaActual] = useState('');
  const [contrasenaNueva, setContrasenaNueva] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setError('');

    try {
      const res = await fetch('http://localhost:3000/api/cambiar-contrasena', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correo,
          contrasena_actual: contrasenaActual,
          contrasena_nueva: contrasenaNueva
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMensaje(data.mensaje || 'Contraseña cambiada con éxito');
        setCorreo('');
        setContrasenaActual('');
        setContrasenaNueva('');
      } else {
        setError(data.mensaje || 'Error al cambiar la contraseña');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
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
        <Typography variant="h6">¡Recupera tu acceso fácilmente!</Typography>
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
            Recuperar Contraseña
          </Typography>
          <form onSubmit={handleSubmit}>
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
              label="Contraseña actual"
              type="password"
              value={contrasenaActual}
              onChange={(e) => setContrasenaActual(e.target.value)}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Nueva contraseña"
              type="password"
              value={contrasenaNueva}
              onChange={(e) => setContrasenaNueva(e.target.value)}
            />
            {error && <Typography color="error">{error}</Typography>}
            {mensaje && <Typography color="primary">{mensaje}</Typography>}
            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{ mt: 2, backgroundColor: '#40245D', color: '#fff' }}
            >
              CAMBIAR CONTRASEÑA
            </Button>
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2">
                <Link
                  component="button"
                  onClick={() => navigate('/login')}
                  underline="hover"
                  sx={{ color: '#40245D', fontWeight: 'bold' }}
                >
                  Volver
                </Link>
              </Typography>
            </Box>

          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default CambiarContrasena;
