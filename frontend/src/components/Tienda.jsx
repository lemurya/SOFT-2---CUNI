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

const assetMap = {
  'Gorro Andino': require('../assets/objetos_tienda/GORRA.png'),
  'Chaleco de Alpaca': require('../assets/objetos_tienda/chompa.png'),
  'Bufanda Morada': require('../assets/objetos_tienda/conejo.png'),
  'Pato': require('../assets/objetos_tienda/PATO.png'),
  'Sapo': require('../assets/objetos_tienda/SA-PO.png'),
  'Silla': require('../assets/silla.png'),
  'Mesa': require('../assets/mesa.png'),
};


const displayName = {
  'Bufanda Morada': 'Orejas Conejo',
  'Chaleco de Alpaca': 'Chompa',
};

const Tienda = () => {
  const { usuario, setUsuario } = useUsuario();
  const [catalogo, setCatalogo] = useState([]);
  const [comprados, setComprados] = useState({});


  useEffect(() => {
  
    fetch('http://localhost:3000/api/tienda/catalogo')
      .then(res => res.json())
      .then(data => {
        setCatalogo([
          ...data,
          { id: 'pato', nombre: 'Pato', costo: 30, tipo: 'accesorio' },
          { id: 'sapo', nombre: 'Sapo', costo: 20, tipo: 'accesorio' }
        ]);
      });

    fetch(`http://localhost:3000/api/tienda/mis-items/${usuario.id}`)
      .then(res => res.json())
      .then(data => {
        const conteo = {};
        data.forEach(item => {
          conteo[item.nombre] = (conteo[item.nombre] || 0) + 1;
        });
        setComprados(conteo);
      });
  }, [usuario.id]);

  const comprarItem = async (productoId) => {
    try {
      const res = await fetch('http://localhost:3000/api/tienda/comprar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuarioId: usuario.id, productoId })
      });

      const data = await res.json();
      if (!res.ok) return alert(data.mensaje);

      setUsuario(prev => ({ ...prev, monedas: data.monedasRestantes }));
      setComprados(prev => ({
        ...prev,
        [data.item.nombre]: (prev[data.item.nombre] || 0) + 1
      }));
      alert(`¡Has comprado: ${data.item.nombre}!`);
    } catch (err) {
      console.error(err);
      alert('Error al comprar');
    }
  };

  const esRepetible = (tipo) => tipo.toLowerCase() === 'silla' || tipo.toLowerCase() === 'mesa';

  return (
    <Box sx={{ padding: 4, bgcolor: '#F3F0FF', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom color="#5D3FD3" fontWeight="bold">
        Tienda de Accesorios
      </Typography>

      <Typography variant="h6" sx={{ mb: 3 }}>
        Monedas disponibles: <strong>{usuario.monedas}</strong>
      </Typography>

      <Grid container spacing={3}>
        {catalogo.map(producto => {
          const yaComprado = comprados[producto.nombre] || 0;
          const repetible = esRepetible(producto.tipo);
          const label = displayName[producto.nombre] || producto.nombre;
          const rawImg = assetMap[producto.nombre];
          const img = rawImg?.default || rawImg;

          return (
            <Grid item xs={12} sm={6} md={4} key={producto.id}>
              <Card elevation={4} sx={{ borderRadius: 3, textAlign: 'center' }}>
             
                {img && (
                  <Box
                    component="img"
                    src={img}
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
                    {producto.costo} monedas
                  </Typography>
                  {yaComprado > 0 && repetible && (
                    <Typography sx={{ mt: 1 }} color="text.secondary">
                      Tienes: {yaComprado}
                    </Typography>
                  )}
                </CardContent>

                <CardActions sx={{ justifyContent: 'center', mb: 1 }}>
                  {!repetible && yaComprado > 0 ? (
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
                      onClick={() => comprarItem(producto.id)}
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
