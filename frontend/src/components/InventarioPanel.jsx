

import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useUsuario } from '../context/UserContext';


import gorraImg   from '../assets/objetos_tienda/GORRA.png';
import chompaImg  from '../assets/objetos_tienda/chompa.png';
import orejaImg   from '../assets/objetos_tienda/conejo.png';
import sillaImg   from '../assets/silla.png';
import mesaImg    from '../assets/mesa.png';


const imageMap = {
  'gorro andino': gorraImg,
  'chaleco de alpaca': chompaImg,
  'bufanda morada': orejaImg,
  'silla': sillaImg,
  'mesa': mesaImg,
};


const displayMap = {
  'chaleco de alpaca': 'Chompa',
  'bufanda morada': 'Orejas Conejo',
  'silla': 'Silla',
  'mesa': 'Mesa',
};

export default function InventarioPanel({ usuarioId }) {
  const { usuario } = useUsuario();
  const [items, setItems] = useState([]);
  const [roomItems, setRoomItems] = useState({});

  const cargarItems = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/tienda/mis-items/${usuarioId}`);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error('Error cargando inventario:', err);
    }
  }, [usuarioId]);

  const cargarRoom = useCallback(async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/room/resumen?usuario_id=${usuarioId}`);
      const data = await res.json();
      setRoomItems(data);
    } catch (err) {
      console.error('Error cargando roomItems:', err);
    }
  }, [usuarioId]);

  const activar = async nombre => {
    try {
      const res = await fetch(`http://localhost:3000/api/tienda/usar-item`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuarioId, itemNombre: nombre })
      });
      const data = await res.json();
      alert(data.mensaje || (res.ok ? 'En uso' : 'Error'));
      await cargarItems();
    } catch (err) {
      console.error('Error activando ítem:', err);
    }
  };

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

  const isRepeatable = tipo =>
    ['silla', 'mesa'].includes(tipo.toLowerCase());

  return (
    <Box>
      
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        Ítems de tienda
      </Typography>
      <Grid container spacing={2}>
        {grouped.map(item => {
          const nombreKey = item.nombre.toLowerCase();
          const tipoKey = item.tipo.toLowerCase();
          const dispName = displayMap[nombreKey] || item.nombre;
          const imgSrc   = imageMap[nombreKey] || imageMap['gorro andino'];
          const repeatable = isRepeatable(item.tipo);

          return (
            <Grid item xs={12} sm={6} key={item.nombre}>
              <Card elevation={2}>
                <CardMedia
                  component="img"
                  height="140"
                  image={imgSrc}
                  alt={dispName}
                  sx={{ objectFit: 'contain', bgcolor: '#fff' }}
                />
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {dispName} {repeatable ? `(${item.cantidad})` : ''}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.tipo}
                  </Typography>
                </CardContent>
                <CardActions>
                  {repeatable ? (
                    <Typography variant="body2">Total: {item.cantidad}</Typography>
                  ) : item.enUso ? (
                    <Chip
                      icon={<CheckCircleIcon />}
                      label="En uso"
                      color="success"
                    />
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

      
      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 3 }}>
        Ítems en la habitación
      </Typography>
      <Grid container spacing={2}>
        {Object.entries(roomItems).map(([tipo, cant]) => {
          const tipoKey = tipo.toLowerCase();
          const dispName = displayMap[tipoKey] || tipo;
          const imgSrc   = imageMap[tipoKey]   || imageMap['gorro andino'];
          return (
            <Grid item xs={12} sm={6} key={tipo}>
              <Card elevation={2}>
                <CardMedia
                  component="img"
                  height="140"
                  image={imgSrc}
                  alt={dispName}
                  sx={{ objectFit: 'contain', bgcolor: '#fff' }}
                />
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {dispName}
                  </Typography>
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
}
