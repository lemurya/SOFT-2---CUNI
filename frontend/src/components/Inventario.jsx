// src/components/Inventario.jsx

import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useUsuario } from '../context/UserContext';

// Mapea nombre → ruta de imagen
const assetMap = {
  'Gorro Andino': require('../assets/objetos_tienda/GORRA.png'),
  'Chaleco de Alpaca': require('../assets/objetos_tienda/chompa.png'),
  'Bufanda Morada': require('../assets/objetos_tienda/conejo.png'),
  'Silla': require('../assets/silla.png'),
  'Mesa': require('../assets/mesa.png'),
};

const Inventario = () => {
  const { usuario } = useUsuario();
  const [items, setItems] = useState([]);
  const [roomItems, setRoomItems] = useState({});

  const cargarItems = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/tienda/mis-items/${usuario.id}`);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error('Error al cargar el inventario:', err);
    }
  }, [usuario.id]);

  const cargarRoomItems = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/room/resumen?usuario_id=${usuario.id}`);
      const data = await res.json();
      setRoomItems(data);
    } catch (err) {
      console.error('Error al cargar ítems de habitación:', err);
    }
  }, [usuario.id]);

  const activarItem = async nombre => {
    try {
      const res = await fetch(`http://localhost:3000/api/tienda/usar-item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuarioId: usuario.id, itemNombre: nombre })
      });
      const data = await res.json();
      alert(data.mensaje || (res.ok ? '¡Item en uso!' : 'Error al activar'));
      cargarItems();
    } catch (err) {
      console.error(err);
      alert('Error en la conexión');
    }
  };

  const itemsAgrupados = Object.values(
    items.reduce((acc, item) => {
      const key = item.nombre;
      if (!acc[key]) {
        acc[key] = { ...item, cantidad: 1 };
      } else {
        acc[key].cantidad++;
      }
      return acc;
    }, {})
  );

  useEffect(() => {
    cargarItems();
    cargarRoomItems();
  }, [cargarItems, cargarRoomItems]);

  return (
    <Box sx={{ p: 4, bgcolor: '#FFFCEC', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom color="#7F6FAE">
        Inventario
      </Typography>

      {/* Ítems comprados */}
      <Typography variant="h5" fontWeight="bold" sx={{ mt: 2 }} color="#7F6FAE">
        Ítems comprados en tienda
      </Typography>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {itemsAgrupados.map(item => {
          const raw = assetMap[item.nombre];
          const img = raw?.default || raw;
          const repetible = ['silla', 'mesa'].includes(item.tipo.toLowerCase());

          return (
            <Grid item xs={12} sm={6} md={4} key={item.nombre}>
              <Card sx={{ borderRadius: 3 }} elevation={3}>
                {img && (
                  <Box
                    component="img"
                    src={img}
                    alt={item.nombre}
                    sx={{
                      width: '100%',
                      height: 140,
                      objectFit: 'contain',
                      bgcolor: '#fff',
                      borderBottom: '1px solid #eee'
                    }}
                  />
                )}

                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {item.nombre} {repetible ? `(${item.cantidad})` : ''}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.tipo}
                  </Typography>
                </CardContent>

                <CardActions sx={{ justifyContent: 'center', mb: 2 }}>
                  {repetible ? (
                    <Typography variant="body2" color="text.secondary">
                      Total adquiridos: {item.cantidad}
                    </Typography>
                  ) : item.enUso ? (
                    <Chip icon={<CheckCircleIcon />} label="En uso" color="success" />
                  ) : (
                    <Button
                      variant="contained"
                      startIcon={<ShoppingCartIcon />}
                      sx={{ bgcolor: '#7F6FAE', '&:hover': { bgcolor: '#473870' } }}
                      onClick={() => activarItem(item.nombre)}
                    >
                      Usar
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Ítems en la habitación */}
      <Typography variant="h5" fontWeight="bold" sx={{ mt: 5 }} color="#7F6FAE">
        Ítems colocados en la habitación
      </Typography>
      <Grid container spacing={3} sx={{ mt: 1 }}>
        {Object.entries(roomItems).map(([tipo, cantidad]) => {
          const raw = assetMap[tipo];
          const img = raw?.default || raw;
          return (
            <Grid item xs={12} sm={6} md={4} key={tipo}>
              <Card sx={{ borderRadius: 3 }} elevation={3}>
                {img && (
                  <Box
                    component="img"
                    src={img}
                    alt={tipo}
                    sx={{
                      width: '100%',
                      height: 140,
                      objectFit: 'contain',
                      bgcolor: '#fff',
                      borderBottom: '1px solid #eee'
                    }}
                  />
                )}
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">
                    {tipo}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tipo decorativo
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Colocados: {cantidad}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default Inventario;
