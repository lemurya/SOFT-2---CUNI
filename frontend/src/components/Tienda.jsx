// src/components/Tienda.jsx

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useUsuario } from '../context/UserContext';

// Mapeo de producto → ruta de imagen
const assetMap = {
  'Gorro Andino': require('../assets/objetos_tienda/GORRA.png'),
  'Chaleco de Alpaca': require('../assets/objetos_tienda/chompa.png'),
  'Bufanda Morada': require('../assets/objetos_tienda/conejo.png'),
  'Pato': require('../assets/objetos_tienda/PATO.png'),
  'Sapo': require('../assets/objetos_tienda/SA-PO.png'),
  'Silla': require('../assets/silla.png'),
  'Mesa': require('../assets/mesa.png'),
};

// Para renombrar algunas etiquetas en la UI
const displayName = {
  'Chaleco de Alpaca': 'Chompa',
  'Bufanda Morada': 'Orejas Conejo',
};

const Tienda = () => {
  const { usuario, setUsuario } = useUsuario();
  const [catalogo, setCatalogo] = useState([]);
  const [comprados, setComprados] = useState({});

  useEffect(() => {
    // 1) Traer catálogo y añadir Pato/Sapo
    fetch('http://localhost:3000/api/tienda/catalogo')
      .then(res => res.json())
      .then(data => {
        setCatalogo([
          ...data,
          { id: 'pato', nombre: 'Pato', costo: 30, tipo: 'accesorio' },
          { id: 'sapo', nombre: 'Sapo', costo: 20, tipo: 'accesorio' },
        ]);
      })
      .catch(console.error);

    // 2) Traer ítems ya comprados para contar
    fetch(`http://localhost:3000/api/tienda/mis-items/${usuario.id}`)
      .then(res => res.json())
      .then(items => {
        const cnt = {};
        items.forEach(i => {
          cnt[i.nombre] = (cnt[i.nombre] || 0) + 1;
        });
        setComprados(cnt);
      })
      .catch(console.error);
  }, [usuario.id]);

  const comprarItem = async productoId => {
    const res = await fetch('http://localhost:3000/api/tienda/comprar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuarioId: usuario.id, productoId })
    });
    const data = await res.json();
    if (!res.ok) {
      return alert(data.mensaje);
    }
    setUsuario(u => ({ ...u, monedas: data.monedasRestantes }));
    setComprados(c => ({
      ...c,
      [data.item.nombre]: (c[data.item.nombre] || 0) + 1
    }));
    alert(`¡Has comprado: ${data.item.nombre}!`);
  };

  // Sillas y mesas se pueden comprar varias veces
  const esRepetible = tipo => ['silla', 'mesa'].includes(tipo.toLowerCase());

  return (
    <Box sx={{ p: 4, bgcolor: '#F3F0FF', minHeight: '100vh' }}>
      <Typography
        variant="h4"
        gutterBottom
        color="#5D3FD3"
        fontWeight="bold"
      >
        Tienda de Accesorios
      </Typography>

      <Typography variant="h6" sx={{ mb: 3 }}>
        Monedas disponibles: <strong>{usuario.monedas}</strong>
      </Typography>

      <Grid container spacing={3}>
        {catalogo.map(prod => {
          const ya = comprados[prod.nombre] || 0;
          const label = displayName[prod.nombre] || prod.nombre;
          const raw = assetMap[prod.nombre];
          const src = raw?.default || raw; // manejar require().default

          return (
            <Grid item xs={12} sm={6} md={4} key={prod.id}>
              <Card elevation={4} sx={{ borderRadius: 3, textAlign: 'center' }}>
                {/* Imagen del producto */}
                {src && (
                  <Box
                    component="img"
                    src={src}
                    alt={label}
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
                    {label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {prod.costo} monedas
                  </Typography>
                  {ya > 0 && esRepetible(prod.tipo) && (
                    <Typography sx={{ mt: 1 }} color="text.secondary">
                      Tienes: {ya}
                    </Typography>
                  )}
                </CardContent>

                <CardActions sx={{ justifyContent: 'center', mb: 1 }}>
                  {!esRepetible(prod.tipo) && ya > 0 ? (
                    <Button variant="contained" disabled sx={{ bgcolor: '#ccc' }}>
                      Ya comprado
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      startIcon={<ShoppingCartIcon />}
                      sx={{
                        bgcolor: '#5D3FD3',
                        '&:hover': { bgcolor: '#4528A4' },
                        borderRadius: 2
                      }}
                      onClick={() => comprarItem(prod.id)}
                    >
                      Comprar
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default Tienda;
