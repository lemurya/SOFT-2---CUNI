import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Button, Chip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useUsuario } from '../context/UserContext';

const Inventario = () => {
  const { usuario } = useUsuario();

  const [items, setItems] = useState([]);
  const [roomItems, setRoomItems] = useState({});

  // 🟣 Cargar ítems de la tienda del usuario
  const cargarItems = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/tienda/mis-items/${usuario.id}`);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error('Error al cargar el inventario:', err);
    }
  }, [usuario.id]);

  // 🔵 Cargar resumen de ítems del Room del usuario
  const cargarRoomItems = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/room/resumen?usuario_id=${usuario.id}`);
      const data = await res.json();
      setRoomItems(data);
    } catch (err) {
      console.error('Error al cargar ítems de habitación:', err);
    }
  }, [usuario.id]);

  // 🟣 Activar ítems comprados en la tienda
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
        cargarItems(); // 🔄 Refresca la vista
      } else {
        alert(data.mensaje || 'Error al activar el ítem');
      }
    } catch (err) {
      console.error(err);
      alert('Error en la conexión');
    }
  };

  // ✅ Agrupar ítems por nombre (para evitar duplicados)
  const itemsAgrupados = Object.values(
    items.reduce((acc, item) => {
      const key = item.nombre;
      if (!acc[key]) {
        acc[key] = { ...item, cantidad: 1 };
      } else {
        acc[key].cantidad += 1;
      }
      return acc;
    }, {})
  );

  useEffect(() => {
    cargarItems();
    cargarRoomItems();
  }, [cargarItems, cargarRoomItems]);

  return (
    <Box sx={{ padding: 4, bgcolor: '#FFFCEC', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom color="#7F6FAE">
        Inventario
      </Typography>

      {/* 🟣 Sección: Ítems de tienda */}
      <Typography variant="h5" fontWeight="bold" sx={{ mt: 2 }} color="#7F6FAE">
        Ítems comprados en tienda
      </Typography>

      <Grid container spacing={3}>
        {itemsAgrupados.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.nombre}>
            <Card sx={{ borderRadius: 3 }} elevation={3}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">{item.nombre}</Typography>
                <Typography variant="body2" color="text.secondary">{item.tipo}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>Costo: {item.costo} monedas</Typography>

                {/* Ocultar botón "Usar" para sillas y mesas */}
                {['silla', 'mesa'].includes(item.tipo.toLowerCase()) ? (
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Total adquiridos: {item.cantidad}
                  </Typography>
                ) : (
                  item.enUso ? (
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
                      sx={{ mt: 2, bgcolor: '#7F6FAE', '&:hover': { bgcolor: '#473870' } }}
                    >
                      Usar
                    </Button>
                  )
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 🔵 Sección: Ítems colocados en la habitación */}
      <Typography variant="h5" fontWeight="bold" sx={{ mt: 5 }} color="#7F6FAE">
        Ítems colocados en la habitación
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {Object.entries(roomItems).map(([tipo, cantidad]) => (
          <Grid item xs={12} sm={6} md={4} key={tipo}>
            <Card sx={{ borderRadius: 3 }} elevation={3}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">{tipo}</Typography>
                <Typography variant="body2" color="text.secondary">Tipo decorativo</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Colocados: {cantidad}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Inventario;
