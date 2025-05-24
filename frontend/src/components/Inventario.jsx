import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button, Chip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useUsuario } from '../context/UserContext';

const Inventario = () => {
  const { usuario } = useUsuario();
  const [items, setItems] = useState([]);

  const cargarItems = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/tienda/mis-items/${usuario.id}`);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error('Error al cargar el inventario:', err);
    }
  };

  const activarItem = async (nombre) => {
    try {
      const res = await fetch(`http://localhost:3000/api/tienda/usar-item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuarioId: usuario.id, itemNombre: nombre })
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.mensaje);
        cargarItems(); // 🔁 Refresca los estados
      } else {
        alert(data.mensaje || 'Error al activar el ítem');
      }
    } catch (err) {
      console.error(err);
      alert('Error en la conexión');
    }
  };

  useEffect(() => {
    cargarItems();
  }, [usuario.id]);

  return (
    <Box sx={{ padding: 4, bgcolor: '#F3F0FF', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom color="#5D3FD3">
        Inventario
      </Typography>

      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.nombre}>
            <Card sx={{ borderRadius: 3 }} elevation={3}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">{item.nombre}</Typography>
                <Typography variant="body2" color="text.secondary">{item.tipo}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>Costo: {item.costo} monedas</Typography>

                {item.enUso ? (
                  <Chip
                    icon={<CheckCircleIcon />}
                    label="En uso"
                    color="success"
                    sx={{ mt: 2 }}
                  />
                ) : (
                  <Button
                    variant="contained"
                    onClick={() => activarItem(item.nombre)}
                    sx={{ mt: 2, bgcolor: '#5D3FD3', '&:hover': { bgcolor: '#4528A4' } }}
                  >
                    Usar
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Inventario;
