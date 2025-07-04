// src/components/InventarioPanel.jsx

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

// Mapa nombre → imagen
const assetMap = {
  'Gorro Andino': require('../assets/objetos_tienda/GORRA.png'),
  'Chaleco de Alpaca': require('../assets/objetos_tienda/chompa.png'),
  'Bufanda Morada': require('../assets/objetos_tienda/conejo.png'),
  'Pato': require('../assets/objetos_tienda/PATO.png'),
  'Sapo': require('../assets/objetos_tienda/SA-PO.png'),
  'Silla': require('../assets/silla.png'),
  'Mesa': require('../assets/mesa.png'),
};

const InventarioPanel = ({ usuarioId }) => {
  const { usuario } = useUsuario();
  const [items, setItems] = useState([]);
  const [roomItems, setRoomItems] = useState({});

  // Carga items comprados
  const cargarItems = useCallback(async () => {
    const res = await fetch(`http://localhost:3000/api/tienda/mis-items/${usuarioId}`);
    const data = await res.json();
    setItems(data);
  }, [usuarioId]);

  // Carga resumen de habitación
  const cargarRoom = useCallback(async () => {
    const res = await fetch(`http://localhost:3000/api/room/resumen?usuario_id=${usuarioId}`);
    const data = await res.json();
    setRoomItems(data);
  }, [usuarioId]);

  // Activar accesorio
  const activar = async nombre => {
    const res = await fetch(`http://localhost:3000/api/tienda/usar-item`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuarioId, itemNombre: nombre })
    });
    const data = await res.json();
    alert(data.mensaje || (res.ok ? 'En uso' : 'Error'));
    cargarItems();
  };

  // Agrupa por nombre
  const grouped = Object.values(
    items.reduce((acc, it) => {
      const key = it.nombre;
      if (!acc[key]) acc[key] = { ...it, cantidad: 1 };
      else acc[key].cantidad++;
      return acc;
    }, {})
  );

  useEffect(() => {
    cargarItems();
    cargarRoom();
  }, [cargarItems, cargarRoom]);

  const isRepeatable = tipo => ['silla','mesa'].includes(tipo.toLowerCase());

  return (
    <Box>
      {/* Comprados */}
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Ítems de tienda
      </Typography>
      <Grid container spacing={2}>
        {grouped.map(item => {
          const raw = assetMap[item.nombre];
          const src = raw?.default || raw;
          const repeatable = isRepeatable(item.tipo);

          return (
            <Grid item xs={12} key={item.nombre}>
              <Card elevation={2}>
                {src && (
                  <Box
                    component="img"
                    src={src}
                    alt={item.nombre}
                    sx={{ width: '100%', height: 100, objectFit: 'contain', bgcolor: '#fff' }}
                  />
                )}
                <CardContent>
                  <Typography fontWeight="bold">
                    {item.nombre} {repeatable ? `(${item.cantidad})` : ''}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.tipo}
                  </Typography>
                </CardContent>
                <CardActions>
                  {repeatable ? (
                    <Typography variant="body2">Total: {item.cantidad}</Typography>
                  ) : item.enUso ? (
                    <Chip icon={<CheckCircleIcon />} label="En uso" color="success" />
                  ) : (
                    <Button
                      size="small"
                      startIcon={<ShoppingCartIcon />}
                      onClick={() => activar(item.nombre)}
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

      {/* Colocados */}
      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 3 }}>
        Ítems en la habitación
      </Typography>
      <Grid container spacing={2}>
        {Object.entries(roomItems).map(([tipo, cant]) => {
          const raw = assetMap[tipo];
          const src = raw?.default || raw;
          return (
            <Grid item xs={12} key={tipo}>
              <Card elevation={2}>
                {src && (
                  <Box
                    component="img"
                    src={src}
                    alt={tipo}
                    sx={{ width: '100%', height: 100, objectFit: 'contain', bgcolor: '#fff' }}
                  />
                )}
                <CardContent>
                  <Typography fontWeight="bold">{tipo}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Colocados: {cant}
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

export default InventarioPanel;
