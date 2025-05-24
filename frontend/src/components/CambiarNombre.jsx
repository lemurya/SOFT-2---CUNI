import React, { useState } from 'react';
import {
  Box, Paper, Typography, TextField, Button, Snackbar, Alert
} from '@mui/material';

const CambiarNombre = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const handleActualizar = async () => {
    if (!nuevoNombre.trim()) {
      setSnackbar({ open: true, message: "El nuevo nombre no puede estar vacío.", severity: 'warning' });
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/usuarios/cambiar-nombre', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo: usuario.correo, nuevoNombre })
      });

      const data = await res.json();
      if (res.ok) {
        usuario.nombre = nuevoNombre;
        localStorage.setItem('usuario', JSON.stringify(usuario));
        setSnackbar({ open: true, message: "✅ Nombre actualizado correctamente. Refresca para ver los cambios.", severity: 'success' });
      } else {
        setSnackbar({ open: true, message: data.mensaje || "Error al actualizar nombre", severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: "❌ Error al conectar con el servidor", severity: 'error' });
    }
  };

  return (
    <Box sx={{ height: '100vh', bgcolor: '#F3F1FE', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Paper sx={{ p: 4, width: 400, textAlign: 'center', borderRadius: 4 }}>
        <Typography variant="h6" gutterBottom>
          Cambiar nombre de usuario
        </Typography>
        <TextField
          fullWidth
          label="Nuevo nombre"
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" onClick={handleActualizar} sx={{ bgcolor: '#5D3FD3' }}>
          Actualizar
        </Button>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CambiarNombre;
